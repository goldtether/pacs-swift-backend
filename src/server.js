require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// ПОДКЛЮЧАЕМ БАЗУ ДАННЫХ
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// РОУТЫ
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payments'));

// ПРОВЕРКА РАБОТЫ
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'PACS Backend is running!'
  });
});

// ГЛАВНАЯ СТРАНИЦА
app.get('/', (req, res) => {
  res.json({
    name: 'PACS SWIFT Backend',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      createPayment: 'POST /api/payment/create',
      paymentStatus: 'GET /api/payment/status/:transactionId'
    }
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // ПОДКЛЮЧЕНИЕ К БД
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // СОЗДАЕМ ТАБЛИЦЫ
    await sequelize.sync();
    console.log('✅ Tables created');
    
    // ЗАПУСК СЕРВЕРА
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📌 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    console.error('Stack:', error.stack);
  }
}

start();
