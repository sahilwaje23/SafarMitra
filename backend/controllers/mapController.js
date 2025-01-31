const {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
} = require("../services/map");
const { validationResult } = require("express-validator");

const handleGetCoordinates = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  const { address } = req.query;
  try {
    const { lat, lng } = await getCoordinates(address);
    res.status(200).json({ lat, lng });
  } catch (err) {
    res.status(400).send({ maperror: err.message });
  }
};

const handleGetDistTime = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ fieldErrors: error.array() });
  }

  const { origin, destination } = req.query;

  try {
    const result = await getDistanceTime(origin, destination);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400).send({ maperror: e.message });
  }
};

const handleGetAutoCompleteSuggestions = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ fieldErrors: errors.array() });
  }

  const { input } = req.query;

  try {
    const result = await getAutoCompleteSuggestions(input);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(400).send({ maperror: e.message });
  }
};

module.exports = {
  handleGetCoordinates,
  handleGetDistTime,
  handleGetAutoCompleteSuggestions,
};
