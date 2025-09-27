// controllers/authController.js

const db = require('../models');
const User = db.User; 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email e senha são obrigatórios' });
      }

     
      const existingUser = await User.findOne({ 
        where: { 
          [db.Sequelize.Op.or]: [
            { email: email },
            { username: username }
          ]
        } 
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Usuário ou email já existe' });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword
      });

      
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, email: newUser.email }, 
        process.env.JWT_SECRET || 'default-secret-key', 
        { expiresIn: '1h' }
      );

      res.status(201).json({ 
        success: true,
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email }, 
        process.env.JWT_SECRET || 'default-secret-key', 
        { expiresIn: '1h' }
      );

      res.json({ 
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          is_active: user.is_active,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}; 