const errorHandler = require("../middlewares/errorHandler");

describe("errorHandler default 500 branch", () => {
  it("returns 500 for unknown errors", () => {
    const req = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json };
    const next = jest.fn();
    const err = new Error("unknown");
    errorHandler(err, req, res, next);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("handles SequelizeUniqueConstraintError as 400 with messages array", () => {
    const req = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json };
    const next = jest.fn();
    const err = {
      name: "SequelizeUniqueConstraintError",
      errors: [{ message: "duplicate" }],
    };
    errorHandler(err, req, res, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: ["duplicate"] });
  });

  it("handles BadRequest -> 400", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const err = { name: "BadRequest", message: "bad" };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "bad" });
  });

  it("handles UnathorizedError -> 401", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const err = { name: "UnathorizedError", message: "nope" };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "nope" });
  });

  it("handles ForbiddenError -> 403", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const err = { name: "ForbiddenError", message: "forbidden" };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "forbidden" });
  });

  it("handles NotFound -> 404", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const err = { name: "NotFound", message: "missing" };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "missing" });
  });
});
