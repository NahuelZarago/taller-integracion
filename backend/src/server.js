import 'dotenv/config';
import { app } from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API de Pet Market Club escuchando en http://localhost:${PORT}`);
});
