const { OpenAI } = require("openai");
const client = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY,
});

module.exports = async function openaiAPI(prompt) {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: prompt,
  });

  return response.output_text;
};
