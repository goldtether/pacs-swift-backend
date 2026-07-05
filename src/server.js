require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const sequelize = require('./config/database');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payments'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

start();
