require('express-async-errors');
const AppError = require("./utils/AppError");

/* SRC/DATABASE/SQLITE/MIGRATIONS */
// Executa o index de migrations
const migrationRun = require('./database/sqlite/migrations')
migrationRun();

/* --------------------------- */

const express = require('express');
const routes = require('./routes');
const app = express(); // Iniciando o express

app.use(express.json());
app.use(routes)
app.use((error, req, response, next) => {
	// CLIENTE
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

	// SERVIDOR
  return response.status(500).json({
    status: "error",
    message: "Interval server error",
  });
});


const PORT = 3333;

app.listen(PORT, () => console.log('Server is running on Port', PORT))