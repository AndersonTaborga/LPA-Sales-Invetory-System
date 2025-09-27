const db = require('./models');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Verificar se já existe um usuário admin
    const existingAdmin = await db.User.findOne({ where: { email: 'admin@lpa.com' } });
    
    if (existingAdmin) {
      console.log('Usuário admin já existe!');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Criar usuário admin
    const adminUser = await db.User.create({
      username: 'admin',
      email: 'admin@lpa.com',
      password: hashedPassword
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@lpa.com');
    console.log('👤 Username: admin');
    console.log('🔑 Senha: admin123');
    console.log('🆔 ID:', adminUser.id);

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await db.sequelize.close();
  }
}

createAdminUser();
