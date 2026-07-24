const Ride = require("../models/ride");
const { getCaptainsInTheRadius } = require("../services/ride");
const { getIO, sendMessageToSocketId } = require("../socket");
const userModel = require("../models/user");

const DISPATCH_BATCH_SIZE = 3;
const DISPATCH_TIMEOUT_MS = 15000;

const { getDistance } = require("../utils/distance");
class DispatchService {
  static async dispatchRide(rideId) {
    try {
      const roomData = await Ride.findById(rideId).populate("creatorId");
      if (!roomData) return;

      const io = getIO();
      const user = roomData.creatorId;

      // 1. Get all nearby drivers (5km radius)
      let captains = await getCaptainsInTheRadius(roomData.pickup.lat, roomData.pickup.lng, 5);
      
      // 2. Sort by nearest distance (using haversine formula)
      captains.sort((a, b) => {
         const distA = getDistance(roomData.pickup.lat, roomData.pickup.lng, a.location.ltd, a.location.lng);
         const distB = getDistance(roomData.pickup.lat, roomData.pickup.lng, b.location.ltd, b.location.lng);
         return distA - distB;
      });

      let batchIndex = 0;
      
      const dispatchNextBatch = async () => {
         try {
             // Check if ride is still open before dispatching next batch
             const currentRide = await Ride.findById(rideId);
             if (!currentRide || currentRide.status !== 'closed') { // 'closed' means searching for driver in this app
                 return; // Stop dispatching if accepted or cancelled
             }

             const startIndex = batchIndex * DISPATCH_BATCH_SIZE;
             const endIndex = startIndex + DISPATCH_BATCH_SIZE;
             const batch = captains.slice(startIndex, endIndex);

             if (batch.length === 0) {
                 console.log(`No more drivers available for ride ${rideId}. Cancelling search.`);
                 // Exhausted drivers -> cancel ride
                 const updatedRide = await Ride.findByIdAndUpdate(rideId, { status: "cancelled" }, { new: true });
                 
                 if (updatedRide) {
                   // Clear currActiveRide for creator
                   await userModel.findByIdAndUpdate(updatedRide.creatorId, { currActiveRide: null });
                   
                   // Clear currActiveRide for all mitras
                   if (updatedRide.mitra && updatedRide.mitra.length > 0) {
                     const mitraIds = updatedRide.mitra.map(m => m.userId);
                     await userModel.updateMany({ _id: { $in: mitraIds } }, { currActiveRide: null });
                   }
                 }

                 io.to(`ride:${rideId}`).emit("ride-not-found", { message: "No drivers were available for your ride." });
                 return; 
             }

             batch.forEach(captain => {
                 // add driver to temporary dispatch room using server-side socketsJoin
                 io.in(`driver:${captain._id}`).socketsJoin(`dispatch:${rideId}`);
                 
                 // notify driver
                 sendMessageToSocketId("new-ride", `driver:${captain._id}`, {
                     roomData,
                     user
                 });
             });

             batchIndex++;

             // Schedule next batch
             setTimeout(dispatchNextBatch, DISPATCH_TIMEOUT_MS);
         } catch (error) {
             console.error("Error in dispatch batch loop:", error);
         }
      };

      // Start the first batch
      await dispatchNextBatch();

    } catch (err) {
      console.error("Dispatch Error:", err);
    }
  }
}

module.exports = DispatchService;
