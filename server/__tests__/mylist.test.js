const request = require("supertest");

// Mock JWT and models to simulate authenticated user
jest.mock("../helpers/jwt", () => ({
  verifyToken: jest.fn(() => ({ id: 1 })),
}));

const mockUserFindByPk = jest.fn();
const mockBookFindByPk = jest.fn();
const mockMyListFindAll = jest.fn();
const mockMyListFindByPk = jest.fn();
const mockMyListFindOne = jest.fn();
const mockMyListCreate = jest.fn();
const mockMyListDestroy = jest.fn();

jest.mock("../models", () => ({
  User: { findByPk: (...a) => mockUserFindByPk(...a) },
  Book: { findByPk: (...a) => mockBookFindByPk(...a) },
  MyList: {
    findAll: (...a) => mockMyListFindAll(...a),
    findByPk: (...a) => mockMyListFindByPk(...a),
    findOne: (...a) => mockMyListFindOne(...a),
    create: (...a) => mockMyListCreate(...a),
    destroy: (...a) => mockMyListDestroy(...a),
  },
}));

const app = require("../app");

describe("MyList routes (authenticated)", () => {
  const auth = { Authorization: "Bearer test" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserFindByPk.mockResolvedValue({ id: 1 });
  });

  it("GET /mylist returns the user list", async () => {
    mockMyListFindAll.mockResolvedValueOnce([{ id: 1, UserId: 1 }]);
    const res = await request(app).get("/mylist").set(auth);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /mylist/:id returns 404 when book not found", async () => {
    mockBookFindByPk.mockResolvedValueOnce(null);
    const res = await request(app).post("/mylist/99").set(auth);
    expect(res.statusCode).toBe(404);
  });

  it("POST /mylist/:id returns 200 if already in list", async () => {
    mockBookFindByPk.mockResolvedValueOnce({ id: 2 });
    mockMyListFindOne.mockResolvedValueOnce({ id: 10, UserId: 1, BookId: 2 });
    const res = await request(app).post("/mylist/2").set(auth);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Already in MyList");
  });

  it("POST /mylist/:id creates when not exists and returns 201", async () => {
    mockBookFindByPk.mockResolvedValueOnce({ id: 3 });
    mockMyListFindOne.mockResolvedValueOnce(null);
    mockMyListCreate.mockResolvedValueOnce({ id: 11, UserId: 1, BookId: 3 });
    const res = await request(app).post("/mylist/3").set(auth);
    expect(res.statusCode).toBe(201);
  });

  it("PATCH /mylist/:id updates note when authorized", async () => {
    const item = { id: 5, UserId: 1, note: null, save: jest.fn() };
    mockMyListFindByPk.mockResolvedValueOnce(item); // onlyUser
    const res = await request(app)
      .patch("/mylist/5")
      .set(auth)
      .send({ note: "hello" });
    expect(res.statusCode).toBe(200);
    expect(item.save).toHaveBeenCalled();
  });

  it("DELETE /mylist/:id removes item when authorized", async () => {
    mockMyListFindByPk.mockResolvedValueOnce({ id: 7, UserId: 1 }); // onlyUser
    mockMyListDestroy.mockResolvedValueOnce(1);
    const res = await request(app).delete("/mylist/7").set(auth);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Removed from MyList");
  });
});

describe("MyList requires authentication", () => {
  it("401 when no token provided", async () => {
    const res = await request(require("../app")).get("/mylist");
    expect(res.statusCode).toBe(401);
  });
});
