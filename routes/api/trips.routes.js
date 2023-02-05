const router = require("express").Router();

const Trip = require("../../models/Trip.model");

router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTrip = await Trip.create(req.body);
    res.json(newTrip);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.put("/:tripId", async (req, res) => {
  try {
    const tripUpdate = await Trip.findByIdAndUpdate(
      req.params.tripId,
      req.body,
      { new: true }
    );
    res.json(tripUpdate);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.delete("/:tripId", async (req, res) => {
  try {
    const tripDelete = await Trip.findByIdAndDelete(req.params.tripId);
    res.json(tripDelete);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

module.exports = router;
