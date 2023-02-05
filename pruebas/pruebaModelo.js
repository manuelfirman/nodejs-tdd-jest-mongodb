const mongoose = require("mongoose");
const Trip = require("../models/trip.model");

mongoose.set("strictQuery", false);
(async () => {
  // await mongoose.connect(
  //   "mongodb+srv://admin:KbpVhnZXI4ggZoU4@tutorial.snewuz3.mongodb.net/?retryWrites=true&w=majority"
  // );
  await mongoose.connect("mongodb://127.0.0.1/familyTrips");

  const newTrip = await Trip.create({
    name: "Probando viaje",
    description: "A ver si funciona",
    destination: "Base de datos",
    category: "trabajo",
    start_date: new Date(),
  });

  console.log(newTrip);
})();
