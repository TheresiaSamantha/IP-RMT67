jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      responses: {
        create: jest.fn().mockResolvedValue({ output_text: "ok" }),
      },
    })),
  };
});

const openaiAPI = require("../helpers/openAi");

describe("helpers/openAi", () => {
  it("creates a response and returns output_text", async () => {
    const out = await openaiAPI("hello");
    expect(out).toBe("ok");
  });
});
