const createMovieTags = `
  CREATE TABLE IF NOT EXISTS movieTags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id INTEGER REFERENCES movieNotes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    name INTEGER NOT NULL
  )
`
module.exports = createMovieTags;