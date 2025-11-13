const request = require("supertest");

// Mocks
const mockFindAndCountAll = jest.fn();
const mockFindByPk = jest.fn();

jest.mock("../models", () => ({
  Book: {
    findAndCountAll: (...args) => mockFindAndCountAll(...args),
    findByPk: (...args) => mockFindByPk(...args),
  },
  User: { findByPk: jest.fn() },
  MyList: {},
}));

const mockOpenAi = jest.fn();
jest.mock(
  "../helpers/openAi",
  () =>
    (...args) =>
      mockOpenAi(...args)
);

const app = require("../app");

describe("Books routes and home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET / should return 200 with message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Server is running");
  });

  it("GET /books returns paginated payload", async () => {
    mockFindAndCountAll.mockResolvedValueOnce({ rows: [{ id: 1 }], count: 1 });

    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("meta");
  });

  it("GET /books returns 500 when DB fails", async () => {
    mockFindAndCountAll.mockRejectedValueOnce(new Error("db down"));
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(500);
  });

  it("GET /books respects page and limit (calls findAndCountAll with correct offset/limit)", async () => {
    mockFindAndCountAll.mockResolvedValueOnce({ rows: [], count: 0 });

    const res = await request(app).get("/books?page=2&limit=2");
    expect(res.statusCode).toBe(200);
    // Ensure the call used the expected pagination params
    const callArg = mockFindAndCountAll.mock.calls[0][0];
    expect(callArg).toEqual(expect.objectContaining({ limit: 2, offset: 2 }));
  });

  it("GET /books/:id returns 404 when not found", async () => {
    mockFindByPk.mockResolvedValueOnce(null);
    const res = await request(app).get("/books/123");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Book not found");
  });

  it("GET /books/:id returns book immediately if aiSummary already exists (no OpenAI call)", async () => {
    const book = { id: 10, title: "T", author: "A", aiSummary: "cached" };
    mockFindByPk.mockResolvedValueOnce(book);

    const res = await request(app).get("/books/10");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("aiSummary", "cached");
    expect(mockOpenAi).not.toHaveBeenCalled();
  });

  it("GET /books/:id generates aiSummary when missing, persists it, and returns it", async () => {
    const update = jest.fn().mockResolvedValue();
    const book = {
      id: 11,
      title: "New Book",
      author: "Someone",
      aiSummary: null,
      update,
    };
    mockFindByPk.mockResolvedValueOnce(book);
    mockOpenAi.mockResolvedValueOnce("AI summary text");

    const res = await request(app).get("/books/11");
    expect(res.statusCode).toBe(200);
    expect(mockOpenAi).toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({ aiSummary: "AI summary text" });
    expect(res.body).toHaveProperty("aiSummary", "AI summary text");
  });
});
