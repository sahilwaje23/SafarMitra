const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    docs: {
      profileImageUrl: {
        type: String,
        default: "/images/defaultUser.png",
      },
      idImageUrl: {
        type: String,
      },
    },
    currActiveRide: {
      type: Schema.Types.ObjectId,
      ref: "ride",
    },
    socket_id: {
      type: String,
    },
    ridesBooked: {
      type: [Schema.Types.ObjectId],
      ref: "ride",
    },
    rating: {
      type: Number,
      default: 0,
    },
    salt: {
      type: String,
    },
    location: {
      ltd: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// for adding a user and generating a token
userSchema.static("addUserAndGenerateToken", async function (data) {
  const {
    fullName,
    email,
    password,
    mobileNo,
    gender,
    profileImagePath,
    idImagePath,
  } = data;
  try {
    // Create a new user
    const newUser = await this.create({
      fullName,
      email,
      password,
      mobileNo,
      gender,
      docs: {
        profileImageUrl: profileImagePath || "/images/defaultUser.png",
        idImageUrl: idImagePath,
      },
    });

    newUser.password = "";
    newUser.salt = "";

    // Generate token
    const token = createToken(newUser);
    return { newUser, token };
  } catch (e) {
    throw new Error(e.message);
  }
});

// for login (checking password and generating token)
userSchema.static(
  "checkPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("Email Not Found");

    const hashedPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) throw new Error("Wrong Password");

    user.password = "";
    user.salt = "";

    // console.log(user);
    const token = createToken(user);
    return { user, token };
  }
);

const User = model("user", userSchema);

module.exports = User;
