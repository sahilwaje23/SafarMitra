const { getDistanceTime } = require("./map");
const { fare } = require("../utilities/fare");
const prisma = require("../config/prisma");
const Drivers = require("../models/driver");
const Ride = require("../models/ride");

/**
 * Creates a new ride and updates the user's active ride.
 *
 * Concurrency & Architecture Notes:
 * 1. Prisma $transaction is used to ensure atomic operations. If any query fails, the entire block rolls back.
 * 2. PostGIS raw SQL ($executeRaw) is used to save geographic points because Prisma classifies geography types as Unsupported.
 */
const createRide = async (userId, pickupText, pickupLat, pickupLng, dropText, dropLat, dropLng, calculatedFare, distance, duration, otp, maxPassengerCount) => {
  return await prisma.$transaction(async (tx) => {
    // 0. Verify the user does not already have an active ride (and lock the row to prevent race conditions)
    const userResult = await tx.$queryRaw`
      SELECT * FROM "users" 
      WHERE "id" = ${userId} 
      FOR UPDATE
    `;
    const user = userResult[0];

    if (!user) {
      throw new Error("User not found");
    }
    if (user.current_active_ride_id) {
      throw new Error("You already have an active ride. Please complete or cancel it before creating a new one.");
    }

    // 1. Create the base ride record (omitting unsupported Geography fields)
    const newRide = await tx.ride.create({
      data: {
        creatorId: userId,
        pickupAddress: pickupText,
        dropAddress: dropText,
        fare: calculatedFare,
        distanceMeters: distance,
        otp: parseInt(otp, 10),
        durationSeconds: duration,
        status: "OPEN",
        maxPassengerCount: parseInt(maxPassengerCount, 10) || 1,
        currentPassengerCount: 1,
      }
    });

    // 2. Set PostGIS location fields using raw SQL (in the same transaction)
    await tx.$executeRaw`
      UPDATE "rides"
      SET "pickup_location" = ST_SetSRID(ST_MakePoint(${pickupLng}, ${pickupLat}), 4326),
          "drop_location" = ST_SetSRID(ST_MakePoint(${dropLng}, ${dropLat}), 4326)
      WHERE "id" = ${newRide.id}
    `;

    // 3. Update the user to reflect their current active ride
    await tx.user.update({
      where: { id: userId },
      data: { currentActiveRideId: newRide.id }
    });

    // 4. Fetch the fully updated ride to return to the controller
    const finalRide = await tx.ride.findUnique({
      where: { id: newRide.id },
      include: { creator: true }
    });

    return finalRide;
  });
};

/**
 * Closes an open ride so it can be dispatched to drivers.
 * Uses Prisma direct update to avoid a find-then-save race condition.
 */
const closeRide = async (rideId, userId) => {
  const parsedId = parseInt(rideId, 10);
  
  const existingRide = await prisma.ride.findUnique({
    where: { id: parsedId }
  });

  if (!existingRide) {
    throw new Error("Room not found");
  }

  if (existingRide.creatorId !== userId) {
    throw new Error("You are not authorized to close this room");
  }

  if (existingRide.status === "SEARCHING") {
    throw new Error("Room is already actively searching for a driver");
  }

  if (existingRide.status !== "OPEN" && existingRide.status !== "CLOSED") {
    throw new Error(`Cannot assign driver. Room is currently in ${existingRide.status} state`);
  }
  
  // 1. Optimistic Concurrency: Update only if it's currently in the expected state
  const result = await prisma.ride.updateMany({
    where: { 
      id: parsedId, 
      creatorId: userId,
      status: existingRide.status
    },
    data: { status: "SEARCHING" },
  });

  if (result.count === 0) {
    throw new Error("Failed to assign driver due to concurrent updates, please try again.");
  }

  // 2. Fetch the updated ride with relations
  return await prisma.ride.findUnique({
    where: { id: parsedId },
    include: { creator: true }
  });
};

const getFare = async (pickupLat, pickupLng, dropLat, dropLng) => {
  if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
    throw new Error("Pickup and destination coordinates are required");
  }

  if (pickupLat === dropLat && pickupLng === dropLng) {
    throw new Error("Pickup and destination cannot be the same");
  }

  const { distance, duration } = await getDistanceTime(
    pickupLat,
    pickupLng,
    dropLat,
    dropLng
  );

  // console.log({distance,duration})
  const distanceCharge = Math.max(distance - 2000, 0) * fare.perMetre;
  const fareOfRide = fare.baseFare + distanceCharge;

  return {
    fare: Math.ceil(fareOfRide),
    distance,
    duration,
  };
};

const getOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

const getCaptainsInTheRadius = async (lat, lng, radius) => {
  try {
    // radius is assumed to be in kilometers. PostGIS ST_DWithin for geography types expects meters.
    const radiusInMeters = radius * 1000;
    
    const captains = await prisma.$queryRaw`
      SELECT *, ST_Y("location"::geometry) AS "lat", ST_X("location"::geometry) AS "lng"
      FROM "drivers"
      WHERE ST_DWithin(
        "location",
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
        ${radiusInMeters}
      )
      AND "status" = 'ONLINE'
    `;

    console.log(`Found ${captains.length} captains within ${radius}km using PostGIS.`);
    return captains;
  } catch (error) {
    throw new Error(`Error fetching captains: ${error.message}`);
  }
};

const searchRides = async (pickupLat, pickupLng, dropLat, dropLng) => {
  // PostGIS spatial query:
  // ST_DWithin(geom1, geom2, distance_in_meters) checks if two geographies are within X meters of each other.
  return await prisma.$queryRaw`
    SELECT * FROM "rides"
    WHERE "status" = 'OPEN'
      AND ST_DWithin("pickup_location", ST_SetSRID(ST_MakePoint(${pickupLng}, ${pickupLat}), 4326), 100)
      AND ST_DWithin("drop_location", ST_SetSRID(ST_MakePoint(${dropLng}, ${dropLat}), 4326), 100)
  `;
};

const confirmRide = async (rideId, driverId) => {
  return await prisma.$transaction(async (tx) => {
    // 0. Verify driver availability
    const driver = await tx.driver.findUnique({ where: { id: driverId } });
    if (!driver) {
      throw new Error("Driver not found");
    }
    if (driver.currentAcceptedRideId || driver.currentActiveRideId) {
      throw new Error("You are already assigned to a ride");
    }

    // 1. Optimistic Concurrency: Ensure it's still closed (broadcasting)
    const result = await tx.ride.updateMany({
      where: { id: parseInt(rideId, 10), status: "CLOSED" },
      data: { status: "ACCEPTED", driverId: driverId }
    });

    if (result.count === 0) {
      throw new Error("Ride already accepted or no longer available");
    }

    // 2. Update the driver's current accepted ride
    await tx.driver.update({
      where: { id: driverId },
      data: { currentAcceptedRideId: parseInt(rideId, 10) }
    });

    // 3. Fetch the fully populated ride (omitting sensitive fields)
    const ride = await tx.ride.findUnique({
      where: { id: parseInt(rideId, 10) },
      include: {
        creator: {
          omit: { password: true, salt: true }
        },
        driver: {
          omit: { password: true, salt: true }
        },
        mitras: {
          include: {
            user: {
              omit: { password: true, salt: true }
            }
          }
        }
      }
    });

    return ride;
  });
};

/**
 * PostGIS Spatial Query Explanations:
 * ST_DWithin: Uses GiST indexes for extremely efficient radius searching to find geometries within a given distance.
 * ST_Distance: Calculates the exact distance between two geometries, used here to rank/sort rides by total proximity.
 * ST_SetSRID: Tags the geometry with the correct spatial reference system (EPSG:4326 for WGS84 - GPS coordinates).
 * ST_MakePoint: Converts raw longitude and latitude floats into a PostGIS point geometry.
 */
const getOpenRidesWithinDistance = async (pLat, pLng, dLat, dLng) => {
  return await prisma.$queryRaw`
    SELECT * FROM (
      SELECT "r".*, 
             ST_Distance("r"."pickup_location", ST_SetSRID(ST_MakePoint(${pLng}, ${pLat}), 4326)) AS "pickupDistance",
             ST_Distance("r"."drop_location", ST_SetSRID(ST_MakePoint(${dLng}, ${dLat}), 4326)) AS "destinationDistance"
      FROM "rides" "r"
      WHERE "r"."status" = 'OPEN'
        AND "r"."current_passenger_count" < "r"."max_passenger_count"
        AND ST_DWithin("r"."pickup_location", ST_SetSRID(ST_MakePoint(${pLng}, ${pLat}), 4326), 1000)
        AND ST_DWithin("r"."drop_location", ST_SetSRID(ST_MakePoint(${dLng}, ${dLat}), 4326), 1000)
    ) AS sub
    ORDER BY "pickupDistance" + "destinationDistance" ASC
  `;
};

const joinRide = async (rideId, userId) => {
  return await prisma.$transaction(async (tx) => {
    // 0. Verify the user does not already have an active ride (and lock the row to prevent race conditions)
    const userResult = await tx.$queryRaw`
      SELECT * FROM "users" 
      WHERE "id" = ${parseInt(userId, 10)} 
      FOR UPDATE
    `;
    const user = userResult[0];

    if (!user) {
      throw new Error("User not found");
    }
    if (user.current_active_ride_id) {
      throw new Error("You already have an active ride. Please complete or cancel it before joining a new one.");
    }

    const ride = await tx.ride.findUnique({ where: { id: parseInt(rideId, 10) } });
    if (!ride) {
      throw new Error("Room not found");
    }
    if (ride.status !== "OPEN") {
      throw new Error("Room is no longer open");
    }
    if (ride.currentPassengerCount >= ride.maxPassengerCount) {
      throw new Error("Room is already full, you cannot join");
    }

    // 1. Optimistic Lock: Update passenger count if space is available and room is OPEN
    const updateResult = await tx.ride.updateMany({
      where: { 
        id: parseInt(rideId, 10), 
        status: "OPEN",
        currentPassengerCount: ride.currentPassengerCount // Ensure it hasn't changed
      },
      data: {
        currentPassengerCount: { increment: 1 }
      }
    });

    if (updateResult.count === 0) {
      throw new Error("Room was modified concurrently, please try again");
    }

    // 2. Link User to Ride
    await tx.rideMitra.create({
      data: { rideId: parseInt(rideId, 10), userId: parseInt(userId, 10) }
    });

    // 3. Update User's Active Ride
    await tx.user.update({
      where: { id: parseInt(userId, 10) },
      data: { currentActiveRideId: parseInt(rideId, 10) }
    });

    // 4. Return populated ride
    return await tx.ride.findUnique({
      where: { id: parseInt(rideId, 10) },
      include: {
        creator: { omit: { password: true, salt: true } },
        mitras: { include: { user: { omit: { password: true, salt: true } } } }
      }
    });
  });
};

const endRide = async (rideId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Optimistic Concurrency: Ensure it's currently ONGOING
    const result = await tx.ride.updateMany({
      where: { id: parseInt(rideId, 10), status: "ONGOING" },
      data: { status: "COMPLETED" }
    });

    if (result.count === 0) {
      throw new Error("Ride not found or not in ONGOING state");
    }

    const ride = await tx.ride.findUnique({
      where: { id: parseInt(rideId, 10) },
      include: { mitras: true }
    });

    // 2. Cleanup Creator
    await tx.user.updateMany({
      where: { currentActiveRideId: ride.id },
      data: { currentActiveRideId: null }
    });

    // 3. Cleanup Driver
    if (ride.driverId) {
      await tx.driver.updateMany({
        where: { currentAcceptedRideId: ride.id },
        data: { currentAcceptedRideId: null }
      });
    }

    // 4. Return ride for emitting
    return ride;
  });
};

const cancelRide = async (rideId, userId, isCreator, isDriver) => {
  return await prisma.$transaction(async (tx) => {
    const id = parseInt(rideId, 10);
    
    if (isCreator) {
      // Creator cancels: Cancel ride completely
      await tx.ride.update({
        where: { id },
        data: { status: "CANCELLED" }
      });

      // Clear users and mitras
      await tx.user.updateMany({
        where: { currentActiveRideId: id },
        data: { currentActiveRideId: null }
      });

      // Clear driver
      await tx.driver.updateMany({
        where: { currentAcceptedRideId: id },
        data: { currentAcceptedRideId: null }
      });

      return { status: "CANCELLED" };
      
    } else if (isDriver) {
      // Driver cancels: Revert to CLOSED, keep passengers intact
      await tx.ride.update({
        where: { id },
        data: { status: "CLOSED", driverId: null }
      });

      // Clear driver's active ride
      await tx.driver.update({
        where: { id: parseInt(userId, 10) },
        data: { currentAcceptedRideId: null }
      });

      return { status: "CLOSED" };
    }
    
    throw new Error("Unauthorized to cancel this ride");
  });
};

module.exports = { 
  getFare, 
  getOtp, 
  getCaptainsInTheRadius, 
  confirmRide, 
  createRide, 
  closeRide, 
  searchRides,
  getOpenRidesWithinDistance,
  joinRide,
  endRide,
  cancelRide
};
