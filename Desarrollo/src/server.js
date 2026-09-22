require('dotenv').config();
const createApp = require('./app');

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor disponible en http://localhost:${port}`);
  console.log(`Documentación en http://localhost:${port}/api-docs`);
});
