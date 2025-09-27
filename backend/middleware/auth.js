// middleware/auth.js

const jwt = require('jsonwebtoken');
const db = require('../models');
const { User } = db;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token de acesso não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido ou usuário inativo'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Token inválido'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Apenas administradores podem acessar este recurso'
    });
  }
  next();
};

const employeeOrAdminMiddleware = (req, res, next) => {
  if (!['admin', 'employee'].includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Apenas funcionários e administradores podem acessar este recurso'
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  employeeOrAdminMiddleware
};
