const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Trip = require("../../models/trip.model");

mongoose.set("strictQuery", false);

describe("Pruebas sobre API de trips", () => {
  beforeAll(async () => {
    // await mongoose.connect(
    //   "mongodb+srv://admin:KbpVhnZXI4ggZoU4@tutorial.snewuz3.mongodb.net/?retryWrites=true&w=majority"
    // );
    await mongoose.connect("mongodb://127.0.0.1/familyTrips");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("GET /api/trips", () => {
    let response;
    beforeEach(async () => {
      response = await request(app).get("/api/trips").send();
    });
    it("La ruta funciona", async () => {
      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    it("La ruta devuelve un array", async () => {
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /api/trips", () => {
    // Modelo correcto
    const newTrip = {
      name: "test trip",
      destination: "Berlin",
      category: "familiar",
      start_date: "2022-06-20",
    };
    // Modelo error
    const wrongTrip = {
      nombre: "test trip",
      destination: "",
    };

    // Borra test cargados a la db
    afterAll(async () => {
      await Trip.deleteMany({ name: "test trip" });
    });

    it("La ruta funciona", async () => {
      const response = await request(app).post("/api/trips").send(newTrip); // solicitud con supertest
      expect(response.statusCode).toBe(200);                        // test status -> 200
      expect(response.headers["content-type"]).toContain("json");   // header content -> json
    });

    it("Se inserta correctamente", async () => {
      const response = await request(app).post("/api/trips").send(newTrip);  // solicitud con supertest
      expect(response.body._id).toBeDefined();          // id -> definido (debe existir)
      expect(response.body.name).toBe(newTrip.name);    // name de body === name del nuevo modelo instanciado
    });

    it("Error en la insercion", async () => {
      const response = await request(app).post("/api/trips").send(wrongTrip);  // solicitud con supertest
      expect(response.statusCode).toBe(500);        // test status -> 500
      expect(response.body.error).toBeDefined();    // error -> definido (debe devolver un error)
    });
  });

  describe("PUT /api/trips", () => {
    let trip;
    beforeEach(async () => {
      // modelo para test
      trip = await Trip.create({
        name: "test trip",
        destination: "Berlin",
        category: "amigos",
        start_date: "2022-06-07",
      });
    });

    afterEach(async () => {
      await Trip.findByIdAndDelete(trip._id); // borra los tests insertados
    });

    it("La ruta funciona", async () => {
      const response = await request(app)
        .put(`/api/trips/${trip._id}`)
        .send({ name: "trip updated" });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    it("Se actualiza correctamente", async () => {
      const response = await request(app)
        .put(`/api/trips/${trip._id}`)
        .send({ name: "trip updated" });

      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("trip updated");
    });
  });

  describe("DELETE /api/trips", () => {
    let trip;
    let response;
    beforeEach(async () => {
      trip = await Trip.create({ // modelo para test
        name: "test trip",
        destination: "Berlin",
        category: "amigos",
        start_date: "2022-06-07",
      });
      
      response = await request(app).delete(`/api/trips/${trip._id}`).send(); // solicitud con supertest antes de cada test
    });

    it("La ruta funciona", async () => {
      expect(response.statusCode).toBe(200);                        // test status -> 200
      expect(response.headers["content-type"]).toContain("json");   // header content -> json
    });

    it("Se borra correctamente", async () => {
        expect(response.body._id).toBeDefined();            // id -> definido (debe existir)

        const foundTrip = await Trip.findById(trip._id);    // busca id para ver si sigue existiendo
        expect(foundTrip).toBeNull();                       // debe ser nulo si se ha eliminado

    })
  });
});
