const description = require("../helpers/openAi");

class Controller {
  static async home(req, res) {
    try {
      res.status(200).json({ message: "Welcome to the Home Page" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async OpenAi(req, res) {
    try {
      const result = await description();
      res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = Controller;
