const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');
const dietRoutes = require('./routes/diet');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/diet', dietRoutes);

// 健康检查
app.get('/api/ping', (req, res) => {
  res.json({ code: 0, msg: 'pong' });
});

app.listen(PORT, () => {
  console.log(`[HealthApp] Server running on http://localhost:${PORT}`);
});
