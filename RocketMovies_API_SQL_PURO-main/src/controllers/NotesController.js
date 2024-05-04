const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite"); // É a conecção com o banco de dados

class NotesController {
  async create(req, res) {
    const { title, description, tags } = req.body;
    const { user_id } = req.params;
    const db = await sqliteConnection();

    // Inserir os dados enviados pelo insominia na tabela
    const note_id = await db.run(
      `INSERT INTO movieNotes (
        title,
        description,
        user_id 
      ) VALUES (?,?,?)`,
      [title, description, user_id]
    );

    tags.forEach(async (tag) => {
      await db.run(
        `INSERT INTO movieTags (
          note_id, 
          user_id, 
          name
        ) VALUES (?,?,?)`,
        [note_id.lastID, user_id, tag]
      );
    }); 

    res.json();
  }

  async show(req, res) {
    const { id } = req.params;
    const db = await sqliteConnection();

    const note = await db.get("SELECT * FROM movieNotes WHERE id = (?)", [id]);
    const tags = await db.all("SELECT * FROM movieTags ORDER BY name");

    return res.json({
      ...note,
      tags,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const db = await sqliteConnection();

    await db.run("DELETE FROM movieNotes WHERE id = (?)", [id]);
    return res.json();
  }

  async index(req, res) {
    const { user_id, title, tags } = req.query;
    const db = await sqliteConnection();

    let notes;

    if(tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await db.all(`
        SELECT movieNotes.id, movieNotes.title, movieNotes.user_id
        FROM movieTags 
        INNER JOIN movieNotes
        ON movieTags.note_id = movieNotes.id
        WHERE name IN ('${filterTags}')
        AND movieNotes.user_id = '${user_id}'
        AND movieNotes.title LIKE '%${title}%'
        ORDER BY movieNotes.title
      `);

    } else {
      notes = await db.all(`
      SELECT * FROM movieNotes WHERE user_id = ('${user_id}') 
      AND title LIKE '%${title}%'
      ORDER BY title`);
    }
    
    const userTags = await db.all(`SELECT * FROM movieTags WHERE user_id = ${user_id}`);
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    })

    return res.json(notesWithTags);
  } 
}

module.exports = NotesController;
