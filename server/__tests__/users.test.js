const request = require("supertest");

// Mock bcrypt helper to control password checks
jest.mock("../helpers/bcrypt.js", () => ({
  comparePassword: jest.fn(),
}));
const { comparePassword } = require("../helpers/bcrypt.js");

// Mock models
const mockCreate = jest.fn();
const mockFindOne = jest.fn();
jest.mock("../models", () => ({
  User: {
    create: (...args) => mockCreate(...args),
    findOne: (...args) => mockFindOne(...args),
    findByPk: jest.fn(),
  },
}));

// Mock google auth verify
const mockVerify = jest.fn();
jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: (...args) => mockVerify(...args),
    })),
  };
});

// Ensure JWT secret exists for sign
process.env.JWT_CODE = process.env.JWT_CODE || "test_secret";

const app = require("../app");

describe("User auth routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("returns 201 on success", async () => {
      mockCreate.mockResolvedValueOnce({ id: 1, email: "a@a.com" });
      const res = await request(app)
        .post("/register")
        .send({ userName: "u", email: "a@a.com", password: "pw" });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("data");
    });

    it("returns 400 on Sequelize validation error", async () => {
      mockCreate.mockRejectedValueOnce({
        name: "SequelizeValidationError",
        errors: [{ message: "email required" }],
      });
      const res = await request(app)
        .post("/register")
        .send({ userName: "u", email: "", password: "pw" });
      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body.message)).toBe(true);
    });
  });

  describe("POST /login", () => {
    it("400 when email missing", async () => {
      const res = await request(app).post("/login").send({ password: "x" });
      expect(res.statusCode).toBe(400);
    });

    it("400 when password missing", async () => {
      const res = await request(app).post("/login").send({ email: "a@a.com" });
      expect(res.statusCode).toBe(400);
    });

    it("401 when user not found", async () => {
      mockFindOne.mockResolvedValueOnce(null);
      const res = await request(app)
        .post("/login")
        .send({ email: "a@a.com", password: "pw" });
      expect(res.statusCode).toBe(401);
    });

    it("401 when password invalid", async () => {
      mockFindOne.mockResolvedValueOnce({ id: 1, password: "hash" });
      comparePassword.mockReturnValueOnce(false);
      const res = await request(app)
        .post("/login")
        .send({ email: "a@a.com", password: "pw" });
      expect(res.statusCode).toBe(401);
    });

    it("200 with access_token on success", async () => {
      mockFindOne.mockResolvedValueOnce({ id: 7, password: "hash" });
      comparePassword.mockReturnValueOnce(true);
      const res = await request(app)
        .post("/login")
        .send({ email: "a@a.com", password: "pw" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("access_token");
    });
  });

  describe("POST /login/google", () => {
    it("returns token for existing user", async () => {
      mockVerify.mockResolvedValueOnce({
        getPayload: () => ({ email: "g@a.com", name: "G" }),
      });
      mockFindOne.mockResolvedValueOnce({ id: 9 });
      const res = await request(app)
        .post("/login/google")
        .send({ googleAccessToken: "idtoken" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("access_token");
    });

    it("auto-creates user if not found and returns token", async () => {
      mockVerify.mockResolvedValueOnce({
        getPayload: () => ({ email: "new@a.com", name: "New" }),
      });
      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({ id: 42 });
      const res = await request(app)
        .post("/login/google")
        .send({ googleAccessToken: "idtoken" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("access_token");
    });

    it("handles verification error with 500", async () => {
      mockVerify.mockRejectedValueOnce(new Error("bad token"));
      const res = await request(app)
        .post("/login/google")
        .send({ googleAccessToken: "bad" });
      expect([500, 401]).toContain(res.statusCode);
    });
  });
});
