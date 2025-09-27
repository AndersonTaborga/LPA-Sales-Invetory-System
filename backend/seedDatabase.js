// seedDatabase.js - Script para popular o banco com dados de exemplo

const db = require('./models');
const { User, Product, Category, Sales, SaleItem, Order, OrderItem } = db;
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Sincronizar banco
    await db.sequelize.sync({ force: true });
    console.log('✅ Banco sincronizado');

    // Criar categorias
    const categories = await Category.bulkCreate([
      { name: 'Mouse', description: 'Mouses e periféricos de pontaria' },
      { name: 'Teclado', description: 'Teclados mecânicos e de membrana' },
      { name: 'Headset', description: 'Fones de ouvido e headsets' },
      { name: 'Webcam', description: 'Câmeras para videoconferência' },
      { name: 'Acessórios', description: 'Acessórios diversos' }
    ]);
    console.log('✅ Categorias criadas');

    // Criar usuários
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@lpa.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'LPA',
        role: 'admin',
        phone: '+61 400 000 000',
        address: 'Sydney, NSW, Australia'
      },
      {
        username: 'vendedor1',
        email: 'vendedor1@lpa.com',
        password: hashedPassword,
        first_name: 'João',
        last_name: 'Silva',
        role: 'employee',
        phone: '+61 400 000 001',
        address: 'Melbourne, VIC, Australia'
      },
      {
        username: 'cliente1',
        email: 'cliente1@lpa.com',
        password: hashedPassword,
        first_name: 'Maria',
        last_name: 'Santos',
        role: 'customer',
        phone: '+61 400 000 002',
        address: 'Brisbane, QLD, Australia'
      }
    ]);
    console.log('✅ Usuários criados');

    // Criar produtos
    const products = await Product.bulkCreate([
      {
        name: 'Logitech MX Master 3',
        description: 'Mouse sem fio premium com scroll infinito e conectividade multi-dispositivo',
        price: 129.99,
        stock: 50,
        category_name: 'Mouse',
        sku: 'LOG-MX3-001',
        image_url: '/api/assets/Logitech MX Master 3.jpeg'
      },
      {
        name: 'Logitech MX Keys',
        description: 'Teclado sem fio com teclas retroiluminadas e conectividade multi-dispositivo',
        price: 149.99,
        stock: 30,
        category_name: 'Teclado',
        sku: 'LOG-MXK-001',
        image_url: '/api/assets/Logitech MX Keys.jpeg'
      },
      {
        name: 'Logitech C920 HD Pro',
        description: 'Webcam HD 1080p com microfone integrado e correção automática de luz',
        price: 89.99,
        stock: 25,
        category_name: 'Webcam',
        sku: 'LOG-C920-001',
        image_url: '/api/assets/Logitech C920 HD Pro.jpeg'
      },
      {
        name: 'Logitech G Pro X',
        description: 'Headset gaming com driver de 50mm e microfone removível',
        price: 199.99,
        stock: 20,
        category_name: 'Headset',
        sku: 'LOG-GPX-001',
        image_url: '/api/assets/Logitech G Pro X.jpeg'
      },
      {
        name: 'Razer DeathAdder V2',
        description: 'Mouse gaming com sensor óptico de 20.000 DPI',
        price: 79.99,
        stock: 40,
        category_name: 'Mouse',
        sku: 'RAZ-DAV2-001',
        image_url: '/api/assets/Razer DeathAdder V2.jpeg'
      },
      {
        name: 'Corsair K95 RGB Platinum',
        description: 'Teclado mecânico com switches Cherry MX e iluminação RGB',
        price: 249.99,
        stock: 15,
        category_name: 'Teclado',
        sku: 'COR-K95-001',
        image_url: '/api/assets/Corsair K95 RGB Platinum.jpeg'
      },
      {
        name: 'SteelSeries Arctis 7',
        description: 'Headset sem fio com áudio surround 7.1 e bateria de 24h',
        price: 179.99,
        stock: 18,
        category_name: 'Headset',
        sku: 'STE-AR7-001',
        image_url: '/api/assets/SteelSeries Arctis 7.jpeg'
      },
      {
        name: 'Blue Yeti USB',
        description: 'Microfone USB com captação em múltiplos padrões',
        price: 129.99,
        stock: 12,
        category_name: 'Acessórios',
        sku: 'BLU-YET-001',
        image_url: '/api/assets/Blue Yeti USB.jpeg'
      }
    ]);
    console.log('✅ Produtos criados');

    // Criar vendas de exemplo
    const sales = await Sales.bulkCreate([
      {
        user_id: users[2].id, // cliente1
        total: 279.98,
        status: 'completed',
        customer_name: 'Maria Santos',
        customer_email: 'cliente1@lpa.com',
        customer_phone: '+61 400 000 002',
        payment_method: 'credit_card',
        notes: 'Venda realizada via e-commerce'
      },
      {
        user_id: users[1].id, // vendedor1
        total: 429.98,
        status: 'completed',
        customer_name: 'João Silva',
        customer_email: 'vendedor1@lpa.com',
        customer_phone: '+61 400 000 001',
        payment_method: 'cash',
        notes: 'Venda presencial'
      },
      {
        user_id: null,
        total: 89.99,
        status: 'pending',
        customer_name: 'Cliente Anônimo',
        customer_email: 'anonimo@email.com',
        customer_phone: '+61 400 000 999',
        payment_method: 'paypal',
        notes: 'Venda online pendente'
      }
    ]);
    console.log('✅ Vendas criadas');

    // Criar itens das vendas
    await SaleItem.bulkCreate([
      // Venda 1 - Maria Santos
      {
        sale_id: sales[0].id,
        product_id: products[0].id, // MX Master 3
        quantity: 1,
        price: 129.99,
        total: 129.99
      },
      {
        sale_id: sales[0].id,
        product_id: products[1].id, // MX Keys
        quantity: 1,
        price: 149.99,
        total: 149.99
      },
      // Venda 2 - João Silva
      {
        sale_id: sales[1].id,
        product_id: products[3].id, // G Pro X
        quantity: 1,
        price: 199.99,
        total: 199.99
      },
      {
        sale_id: sales[1].id,
        product_id: products[5].id, // K95 RGB
        quantity: 1,
        price: 249.99,
        total: 249.99
      },
      // Venda 3 - Cliente Anônimo
      {
        sale_id: sales[2].id,
        product_id: products[2].id, // C920
        quantity: 1,
        price: 89.99,
        total: 89.99
      }
    ]);
    console.log('✅ Itens de venda criados');

    // Criar pedidos
    const orders = await Order.bulkCreate([
      {
        user_id: users[2].id, // cliente1
        total_amount: 199.98,
        status: 'completed',
        shipping_address: '123 Main St, Sydney, NSW 2000, Australia',
        payment_method: 'credit_card',
        customer_name: 'Maria Santos',
        customer_email: 'cliente1@lpa.com',
        customer_phone: '+61 400 000 002',
        notes: 'Please deliver after 2 PM'
      },
      {
        user_id: users[2].id, // cliente1
        total_amount: 89.99,
        status: 'pending',
        shipping_address: '456 Queen St, Melbourne, VIC 3000, Australia',
        payment_method: 'paypal',
        customer_name: 'Maria Santos',
        customer_email: 'cliente1@lpa.com',
        customer_phone: '+61 400 000 002',
        notes: 'Gift wrapping requested'
      },
      {
        user_id: users[1].id, // vendedor1
        total_amount: 249.99,
        status: 'shipped',
        shipping_address: '789 Collins St, Melbourne, VIC 3000, Australia',
        payment_method: 'bank_transfer',
        customer_name: 'João Silva',
        customer_email: 'vendedor1@lpa.com',
        customer_phone: '+61 400 000 001',
        notes: 'Urgent delivery'
      }
    ]);
    console.log('✅ Pedidos criados');

    // Criar itens de pedido
    await OrderItem.bulkCreate([
      // Pedido 1 - Cliente1
      {
        order_id: orders[0].id,
        product_id: products[0].id, // MX Master 3
        quantity: 1,
        price: 99.99,
        total: 99.99
      },
      {
        order_id: orders[0].id,
        product_id: products[1].id, // G Pro X
        quantity: 1,
        price: 99.99,
        total: 99.99
      },
      // Pedido 2 - Cliente1
      {
        order_id: orders[1].id,
        product_id: products[2].id, // C920
        quantity: 1,
        price: 89.99,
        total: 89.99
      },
      // Pedido 3 - Vendedor1
      {
        order_id: orders[2].id,
        product_id: products[5].id, // K95 RGB
        quantity: 1,
        price: 249.99,
        total: 249.99
      }
    ]);
    console.log('✅ Itens de pedido criados');

    console.log('🎉 Seed do banco de dados concluído com sucesso!');
    console.log('\n📊 Resumo dos dados criados:');
    console.log(`- ${categories.length} categorias`);
    console.log(`- ${users.length} usuários`);
    console.log(`- ${products.length} produtos`);
    console.log(`- ${sales.length} vendas`);
    console.log(`- ${orders.length} pedidos`);
    console.log('\n🔑 Credenciais de acesso:');
    console.log('Admin: admin@lpa.com / 123456');
    console.log('Vendedor: vendedor1@lpa.com / 123456');
    console.log('Cliente: cliente1@lpa.com / 123456');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await db.sequelize.close();
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
