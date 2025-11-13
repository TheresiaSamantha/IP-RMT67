const { signToken, verifyToken } = require("../helpers/jwt");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");

describe("helpers/jwt", () => {
  const OLD = process.env.JWT_CODE;
  beforeAll(() => {
    process.env.JWT_CODE = "secret";
  });
  afterAll(() => {
    process.env.JWT_CODE = OLD;
  });

  it("signs and verifies a token", () => {
    const token = signToken({ id: 123 });
    const payload = verifyToken(token);
    expect(payload).toHaveProperty("id", 123);
  });
});

describe("helpers/bcrypt", () => {
  it("hashPassword throws when missing", async () => {
    await expect(hashPassword()).rejects.toThrow();
  });

  it("hash and compare works", async () => {
    const hash = await hashPassword("pw");
    expect(typeof hash).toBe("string");
    const ok = await comparePassword("pw", hash);
    const bad = await comparePassword("nope", hash);
    expect(ok).toBe(true);
    expect(bad).toBe(false);
  });

  it("comparePassword returns false when inputs missing", async () => {
    expect(await comparePassword(null, "hash")).toBe(false);
    expect(await comparePassword("pw", null)).toBe(false);
  });
});
