const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../src/models/user");

const testUserId = new mongoose.Types.ObjectId();

const testUser = {
  _id: testUserId,
  name: "mike test",
  email: "miketest@1212.com",
  password: "iamthatguymike",
  tokens: [
    {
      token: jwt.sign({ _id: testUserId }, "mytopsecret"),
    },
  ],
};

beforeEach(async () => {
  // tear down db
  await User.deleteMany();
  await new User(testUser).save();
});

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

test("should login user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .expect(200);
});

test("login failure of non existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "somefake@gmail.com",
      password: "dhsdhfshfshkhsdfk",
    })
    .expect(400);
});

test("should return user profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not return profile", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete user account", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .expect(200);
});

test("should not delete user account for unathorized user", async () => {
  await request(app).delete("/users/me").expect(401);
});
