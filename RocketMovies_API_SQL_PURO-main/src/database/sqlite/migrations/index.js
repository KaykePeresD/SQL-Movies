const sqliteConnection = require('../../sqlite');
const createUsers = require('./createUsers');
const createMovieNotes = require('./createMovieNotes');
const createMovieTags = require('./createMovieTags');

async function migrationRun() {
  const db = await sqliteConnection();

  try {
    await db.exec(createUsers);
    await db.exec(createMovieNotes);
    await db.exec(createMovieTags);
  } catch (err) {
    console.log(err)
  }
}

module.exports = migrationRun;