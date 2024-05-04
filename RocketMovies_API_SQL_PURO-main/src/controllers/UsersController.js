const { hash, compare } = require('bcryptjs'); // Recebe a função de criptografia de senha
const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite'); // É a conecção com o banco de dados

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;
    const db = await sqliteConnection();

    // Selecionar todos os usuarios onde o email é igual ao email do request.body
    const checkUserExists = await db.get('SELECT * FROM users WHERE email = (?)', [email]);

    if(checkUserExists) {
      throw new AppError('Este e-mail já está em uso.');
    }
    // Criptografando a senha do usuário
    const hashadPassword = await hash(password, 8);
    // Inserir dados do Usuários
    await db.run('INSERT INTO users (name, email, password) VALUES (?,?,?)',
      [name, email, hashadPassword]
    );

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password} = req.body;
    const { id } = req.params;

    const db = await sqliteConnection();

    const user = await db.get('SELECT * FROM users WHERE id = (?)', [id]);
    if(!user) {
      throw new AppError('Usuário não encontrado!');
    }

    const userWithUpdatedEmail = await db.get('SELECT * FROM users WHERE email = (?)', [email]);
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    
    if(password && !old_password) {
      throw new AppError('Você precisa informar a senha antiga para definir a nova senha!')
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError('A senha antiga não confere.');
      }

      user.password = await hash(password, 8);
    }

    await db.run(`
      UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
      WHERE id = ?`,[
        user.name,
        user.email,
        user.password,
        id
      ]
    );

    return res.status(200).json();
  }
}

module.exports = UsersController;