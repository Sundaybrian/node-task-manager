const request = require("supertest");
const app = require("../src/app");

test("should sign up a user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Brian sundi",
      email: "brians931@gmail.com",
      password: "march2013",
    })
    .expect(201);
});
