const prisma = require("../config/prisma");
const { getCaptainsInTheRadius } = require("../services/ride");
const { getIO, sendMessageToSocketId } = require("../socket");
const { getDistance } = require("../utils/distance");

const DISPATCH_BATCH_SIZE = 3;
const DISPATCH_TIMEOUT_MS = 15000;

const activeSearches = new Set();

class DispatchService {
  static async dispatchRide(rideId) {
    try {
      const parsedId = parseInt(rideId, 10);
      
      if (activeSearches.has(parsedId)) {
        console.log(`Search already active for ride ${parsedId}. Ignoring duplicate request.`);
        return;
      }
      activeSearches.add(parsedId);

      const [ride, locations] = await Promise.all([
        prisma.ride.findUnique({
          where: { id: parsedId },
          include: { 
            creator: { omit: { password: true, salt: true } }, 
            mitras: { include: { user: { omit: { password: true, salt: true } } } } 
          }
        }),
        prisma.$queryRaw`
          SELECT ST_Y("pickup_location"::geometry) AS "pickupLat", 
                 ST_X("pickup_location"::geometry) AS "pickupLng",
                 ST_Y("drop_location"::geometry) AS "dropLat", 
                 ST_X("drop_location"::geometry) AS "dropLng"
          FROM "rides" 
          WHERE "id" = ${parsedId}
        `
      ]);

      if (!ride) {
        activeSearches.delete(parsedId);
        return;
      }

      if (locations && locations.length > 0) {
        ride.pickup = { lat: locations[0].pickupLat, lng: locations[0].pickupLng, text: ride.pickupAddress };
        ride.destination = { lat: locations[0].dropLat, lng: locations[0].dropLng, text: ride.dropAddress };
      } else {
        activeSearches.delete(parsedId);
        return; 
      }

      const io = getIO();
      const user = ride.creator;
      const roomData = ride;

      // 1. Get all nearby drivers (5km radius)
      let captains = await getCaptainsInTheRadius(roomData.pickup.lat, roomData.pickup.lng, 5);

      
      
      // 2. Sort by nearest distance (using haversine formula)
      captains.sort((a, b) => {
         // a and b now have .lat and .lng from our updated ST_Y/ST_X query
         const distA = getDistance(roomData.pickup.lat, roomData.pickup.lng, a.lat, a.lng);
         const distB = getDistance(roomData.pickup.lat, roomData.pickup.lng, b.lat, b.lng);
         return distA - distB;
      });

      console.log(captains)

      let batchIndex = 0;
      
      const dispatchNextBatch = async () => {
         try {
             // Check if ride is still searching before dispatching next batch
             const currentRide = await prisma.ride.findUnique({ where: { id: parsedId } });
             if (!currentRide || currentRide.status !== 'SEARCHING') {
                 activeSearches.delete(parsedId);
                 return; // Stop dispatching if accepted, closed, or cancelled
             }

             const startIndex = batchIndex * DISPATCH_BATCH_SIZE;
             const endIndex = startIndex + DISPATCH_BATCH_SIZE;
             const batch = captains.slice(startIndex, endIndex);

             if (batch.length === 0) {
                 console.log(`No more drivers available for ride ${parsedId}. Cancelling search.`);
                 // Revert status to CLOSED in database so user can retry the search if they want
                 await prisma.ride.update({
                     where: { id: parsedId },
                     data: { status: "CLOSED" }
                 }).catch(err => console.error("Error reverting ride status to CLOSED:", err));

                 io.to(`ride:${parsedId}`).emit("ride-not-found", { message: "No drivers were available for your ride." });
                 activeSearches.delete(parsedId);
                 return; 
             }

             batch.forEach(captain => {
                 // add driver to temporary dispatch room using server-side socketsJoin
                 io.in(`driver:${captain.id}`).socketsJoin(`dispatch:${parsedId}`);
                 
                 // notify driver
                 sendMessageToSocketId("new-ride", `driver:${captain.id}`, {
                     roomData,
                     user
                 });
             });

             batchIndex++;

             // Schedule next batch
             setTimeout(dispatchNextBatch, DISPATCH_TIMEOUT_MS);
         } catch (error) {
             console.error("Error in dispatch batch loop:", error);
             activeSearches.delete(parsedId);
         }
      };

      // Start the first batch
      dispatchNextBatch();

    } catch (error) {
      console.error("Error initiating ride dispatch:", error);
      activeSearches.delete(parseInt(rideId, 10));
    }
  }
}

module.exports = DispatchService;
