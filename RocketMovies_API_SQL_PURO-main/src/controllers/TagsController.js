const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite"); 

class TagsController {
  async index(req, res) {
    const { user_id } = req.params;
    const db = await sqliteConnection();

    const tags = await db.all(`SELECT * FROM Movietags WHERE user_id = ${user_id}`)

    return res.json(tags);
  }
}

module.exports = TagsController;