const authentication = require("../middlewares/authentication");
const onlyUser = require("../middlewares/onlyUser");

// Mocks for jwt and models
jest.mock("../helpers/jwt", () => ({
  verifyToken: jest.fn(),
}));
const { verifyToken } = require("../helpers/jwt");

const mockFindByPkUser = jest.fn();
const mockFindByPkMyList = jest.fn();
jest.mock("../models", () => ({
  User: { findByPk: (...args) => mockFindByPkUser(...args) },
  MyList: { findByPk: (...args) => mockFindByPkMyList(...args) },
}));

describe("authentication middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  it("401 when no auth header", async () => {
    const req = { headers: {} };
    const res = {};
    const next = jest.fn();
    await authentication(req, res, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err?.name).toBe("UnathorizedError");
  });

  it("401 when token invalid (user not found)", async () => {
    const req = { headers: { authorization: "Bearer abc" } };
    const res = {};
    const next = jest.fn();
    verifyToken.mockReturnValueOnce({ id: 99 });
    mockFindByPkUser.mockResolvedValueOnce(null);
    await authentication(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err?.name).toBe("UnathorizedError");
  });

  it("calls next with user when valid", async () => {
    const req = { headers: { authorization: "Bearer good" } };
    const res = {};
    const next = jest.fn();
    verifyToken.mockReturnValueOnce({ id: 1 });
    mockFindByPkUser.mockResolvedValueOnce({ id: 1 });
    await authentication(req, res, next);
    expect(req.user).toEqual({ id: 1 });
    expect(next).toHaveBeenCalledWith();
  });
});

describe("onlyUser middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  it("skips when no id param", async () => {
    const req = { params: {}, user: { id: 1 } };
    const res = {};
    const next = jest.fn();
    await onlyUser(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("404 when mylist item not found", async () => {
    const req = { params: { id: "5" }, user: { id: 1 } };
    const res = {};
    const next = jest.fn();
    mockFindByPkMyList.mockResolvedValueOnce(null);
    await onlyUser(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err?.name).toBe("NotFound");
  });

  it("403 when item belongs to another user", async () => {
    const req = { params: { id: "5" }, user: { id: 1 } };
    const res = {};
    const next = jest.fn();
    mockFindByPkMyList.mockResolvedValueOnce({ id: 5, UserId: 2 });
    await onlyUser(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err?.name).toBe("ForbiddenError");
  });

  it("attaches item and next() when authorized", async () => {
    const req = { params: { id: "5" }, user: { id: 1 } };
    const res = {};
    const next = jest.fn();
    mockFindByPkMyList.mockResolvedValueOnce({ id: 5, UserId: 1 });
    await onlyUser(req, res, next);
    expect(req.myListItem).toEqual({ id: 5, UserId: 1 });
    expect(next).toHaveBeenCalledWith();
  });
});
