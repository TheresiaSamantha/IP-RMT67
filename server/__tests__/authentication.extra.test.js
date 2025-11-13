const authentication = require("../middlewares/authentication");

jest.mock("../helpers/jwt", () => ({
  verifyToken: jest.fn(),
}));
const { verifyToken } = require("../helpers/jwt");

jest.mock("../models", () => ({
  User: { findByPk: jest.fn() },
}));

describe("authentication middleware extra branches", () => {
  it("handles JsonWebTokenError -> 401", async () => {
    const req = { headers: { authorization: "Bearer bad" } };
    const res = {};
    const next = jest.fn();
    verifyToken.mockImplementationOnce(() => {
      const e = new Error("bad");
      e.name = "JsonWebTokenError";
      throw e;
    });
    await authentication(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err?.name).toBe("UnathorizedError");
  });

  it("handles unexpected error -> 500", async () => {
    const req = { headers: { authorization: "Bearer bad" } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = { status, json };
    const next = jest.fn();
    verifyToken.mockImplementationOnce(() => {
      throw new Error("boom");
    });
    await authentication(req, res, next);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
