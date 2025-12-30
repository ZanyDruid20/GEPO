require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000; // use 4000 to avoid collisions
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});