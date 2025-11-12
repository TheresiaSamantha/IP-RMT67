const { OpenAI } = require("openai");

function description(inputText) {
  const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
  });

  const response = openai.responses.create({
    model: "gpt-5-nano",
    input: "write a haiku about ai",
    //   store: true,
  });
  return response;
}

module.exports = { description };
