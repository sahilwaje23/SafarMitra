require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectToMongoDb = require("./connection");
const userRouter = require("./routes/userRouter");
const driverRouter = require("./routes/driverRouter");
const mapRouter = require("./routes/mapRouter");
const rideRouter = require("./routes/rideRouter");

const MONGO_URL = process.env.MONGO_URL;

const app = express();
connectToMongoDb(MONGO_URL)
  .then(() => console.log("MongoDB Connected !"))
  .catch((e) => {
    console.log(`MONGODB ERROR ${e}`);
  });

// ^ Middle Wares
app.use(
  cors({
    origin: "https://g4xx34w2-5173.inc1.devtunnels.ms",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// ^ Routes :
app.use("/", userRouter);
app.use("/driver", driverRouter);
app.use("/map", mapRouter);
app.use("/ride", rideRouter);

app.use("/test_user", (req, res) => res.render("singup"));
app.use("/test_driver", (req, res) => res.render("driverSingup"));

module.exports = app;
