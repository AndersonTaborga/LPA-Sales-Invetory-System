# LPA Sales Inventory System - Backend

Backend centralizado para o sistema de vendas e inventário da Logic Peripherals Australia (LPA).

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## 📁 Estrutura do Projeto

```
backend/
├── controllers/          # Lógica de negócio
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── salesController.js
│   ├── orderController.js
│   └── reportController.js
├── middleware/           # Middlewares
│   └── auth.js
├── models/              # Modelos de dados
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Sales.js
│   ├── SaleItem.js
│   ├── Order.js
│   ├── OrderItem.js
│   └── index.js
├── routes/              # Rotas da API
│   ├── users.js
│   ├── products.js
│   ├── categories.js
│   ├── sales.js
│   ├── orders.js
│   └── reports.js
├── config/              # Configurações
│   ├── config.json
│   └── database.js
├── app.js               # Aplicação principal
├── server.js            # Servidor
├── syncDatabase.js      # Sincronização do banco
├── seedDatabase.js      # Dados de exemplo
└── package.json         # Dependências
```

## 🛠️ Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp env.example .env
   # Editar .env com suas configurações
   ```

3. **Sincronizar banco de dados:**
   ```bash
   npm run sync-db
   ```

4. **Popular com dados de exemplo:**
   ```bash
   npm run seed
   ```

5. **Iniciar servidor:**
   ```bash
   npm start
   # ou para desenvolvimento
   npm run dev
   ```

## 📚 API Endpoints

### Autenticação
- `POST /api/users/login` - Login
- `POST /api/users/register` - Registro

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Obter produto
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `PATCH /api/products/:id/stock` - Atualizar estoque
- `GET /api/products/low-stock` - Produtos com estoque baixo

### Categorias
- `GET /api/categories` - Listar categorias
- `GET /api/categories/:id` - Obter categoria
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Vendas
- `GET /api/sales` - Listar vendas
- `GET /api/sales/:id` - Obter venda
- `POST /api/sales` - Criar venda
- `PUT /api/sales/:id` - Atualizar venda
- `DELETE /api/sales/:id` - Deletar venda

### Pedidos
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Obter pedido
- `POST /api/orders` - Criar pedido
- `PATCH /api/orders/:id/status` - Atualizar status
- `DELETE /api/orders/:id` - Deletar pedido

### Relatórios
- `GET /api/reports/dashboard` - Resumo do dashboard
- `GET /api/reports/sales` - Relatório de vendas
- `GET /api/reports/top-products` - Produtos mais vendidos
- `GET /api/reports/customers` - Relatório de clientes
- `GET /api/reports/stock` - Relatório de estoque

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 📊 Modelos de Dados

### User
- `id` - ID único
- `username` - Nome de usuário
- `email` - Email
- `password` - Senha (hash)
- `first_name` - Primeiro nome
- `last_name` - Último nome
- `role` - Papel (admin, employee, customer)
- `phone` - Telefone
- `address` - Endereço
- `is_active` - Ativo
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Product
- `id` - ID único
- `name` - Nome
- `description` - Descrição
- `price` - Preço
- `stock` - Estoque
- `image_url` - URL da imagem
- `category` - Categoria
- `sku` - SKU
- `is_active` - Ativo
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Sales
- `id` - ID único
- `user_id` - ID do usuário
- `total` - Total
- `status` - Status (pending, completed, cancelled)
- `customer_name` - Nome do cliente
- `customer_email` - Email do cliente
- `customer_phone` - Telefone do cliente
- `payment_method` - Método de pagamento
- `notes` - Observações
- `created_at` - Data de criação
- `updated_at` - Data de atualização

## 🧪 Dados de Exemplo

O script de seed cria:

- **3 usuários:**
  - Admin: `admin@lpa.com` / `123456`
  - Vendedor: `vendedor1@lpa.com` / `123456`
  - Cliente: `cliente1@lpa.com` / `123456`

- **5 categorias:** Mouse, Teclado, Headset, Webcam, Acessórios

- **8 produtos:** Logitech MX Master 3, MX Keys, C920, G Pro X, etc.

- **3 vendas:** Com itens e totais calculados

## 🔧 Scripts Disponíveis

- `npm start` - Iniciar servidor
- `npm run dev` - Iniciar em modo desenvolvimento
- `npm run sync-db` - Sincronizar banco de dados
- `npm run seed` - Popular com dados de exemplo

## 🌐 Configuração de CORS

O servidor está configurado para aceitar requisições de:
- `http://localhost:3000` (Frontend React)
- `http://localhost:8080` (Frontend PHP)

## 📝 Logs

Os logs são exibidos no console e incluem:
- Requisições HTTP
- Erros de banco de dados
- Erros de autenticação
- Operações de CRUD

## 🚀 Deploy

Para produção:

1. Configure as variáveis de ambiente
2. Use um banco de dados PostgreSQL ou MySQL
3. Configure HTTPS
4. Use um processo manager como PM2
5. Configure logs persistentes

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
