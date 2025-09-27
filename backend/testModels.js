const db = require('./models');

async function test() {
  await db.sequelize.authenticate();
  console.log('Connection has been established successfully.');

  // Create a user
  const user = await db.User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'customer'
  });
  console.log('User created:', user.toJSON());
}

test().catch(console.error);
