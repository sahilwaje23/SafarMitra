const { Schema, model } = require("mongoose");

const blacklistTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, 
  },
});

const BlackList = model("blacklisttoken", blacklistTokenSchema);

module.exports = BlackList;
