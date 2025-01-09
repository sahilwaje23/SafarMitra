const { connect } = require("mongoose");

connectToMongoDb = async (url) => {
  return connect(url);
};

module.exports = connectToMongoDb;
