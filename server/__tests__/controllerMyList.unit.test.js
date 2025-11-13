const ControllerMyList = require("../controllers/controllerMyList");

// Mock models used inside controller
const mockFindAll = jest.fn();
const mockFindByPk = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockDestroy = jest.fn();

jest.mock("../models", () => ({
  MyList: {
    findAll: (...a) => mockFindAll(...a),
    findByPk: (...a) => mockFindByPk(...a),
    findOne: (...a) => mockFindOne(...a),
    create: (...a) => mockCreate(...a),
    destroy: (...a) => mockDestroy(...a),
  },
  Book: { findByPk: jest.fn() },
}));

describe("ControllerMyList unit error paths", () => {
  beforeEach(() => jest.clearAllMocks());

  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  it("getMyList throws UnathorizedError when no user", async () => {
    await ControllerMyList.getMyList({ user: null }, res, next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]?.name).toBe("UnathorizedError");
  });

  it("addToMyList throws BadRequest when no BookId param", async () => {
    await ControllerMyList.addToMyList(
      { user: { id: 1 }, params: {} },
      res,
      next
    );
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]?.name).toBe("BadRequest");
  });

  it("updateNote NotFound when item missing", async () => {
    mockFindByPk.mockResolvedValueOnce(null);
    await ControllerMyList.updateNote(
      { user: { id: 1 }, params: { id: "1" }, body: { note: "x" } },
      res,
      next
    );
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]?.name).toBe("NotFound");
  });

  it("updateNote Forbidden when item belongs to other user", async () => {
    mockFindByPk.mockResolvedValueOnce({ id: 1, UserId: 2 });
    await ControllerMyList.updateNote(
      { user: { id: 1 }, params: { id: "1" }, body: { note: "x" } },
      res,
      next
    );
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]?.name).toBe("Forbidden");
  });

  it("deleteFromMyList NotFound when item missing by id", async () => {
    mockFindByPk.mockResolvedValueOnce(null);
    await ControllerMyList.deleteFromMyList(
      { user: { id: 1 }, params: { id: "99" } },
      res,
      next
    );
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]?.name).toBe("NotFound");
  });

  it("deleteFromMyList falls back to BookId lookup and deletes when owned", async () => {
    mockFindByPk.mockResolvedValueOnce(null); // first by id -> null
    mockFindOne.mockResolvedValueOnce({ id: 50, UserId: 1, BookId: 7 });
    mockDestroy.mockResolvedValueOnce(1);
    const req = { user: { id: 1 }, params: { id: "7" } };
    await ControllerMyList.deleteFromMyList(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Removed from MyList" });
  });

  it("updateNote uses req.myListItem when provided", async () => {
    const item = { id: 2, UserId: 1, save: jest.fn() };
    await ControllerMyList.updateNote(
      {
        user: { id: 1 },
        params: { id: "2" },
        body: { note: "n" },
        myListItem: item,
      },
      res,
      next
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
