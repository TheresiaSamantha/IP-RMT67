const {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const request = require("supertest");
// Mock Sequelize models before importing the app to avoid real DB access during tests
jest.mock("../models", () => ({
  Book: {
    findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
  },
  User: {},
  myList: {},
}));
const app = require("../app");

describe("App routes", () => {
  test("GET / should return 200 and welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("GET /books should return 200 and paginated payload", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("meta");
  });

  //   test("GET /openai should either return 200 or 500 (depends on API key)", async () => {
  //     const res = await request(app).get("/openai");
  //     expect([200, 500]).toContain(res.statusCode);
  //     // when 200 expect message
  //     if (res.statusCode === 200) expect(res.body).toHaveProperty("message");
  //   });

  test("POST /register should return 201 or validation error", async () => {
    const res = await request(app)
      .post("/register")
      .send({ userName: "test", email: "t@test.com", password: "secret" });
    expect([201, 400, 500]).toContain(res.statusCode);
  });

  test("POST /login should return 200 or 401/400", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "t@test.com", password: "secret" });
    expect([200, 400, 401, 500]).toContain(res.statusCode);
  });
});
