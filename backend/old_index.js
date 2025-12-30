const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

// Middleware to parse JSON
app.use(express.json());

// Root routes
app.get('/', (req, res) => {
  res.send('hello world of GEPO');
});

app.post('/', (req, res) => {
  res.send('POST request to the homepage')
});

// About route
app.get('/about', (req, res) => {
  res.send('about')
});

// User routes
app.get('/user/:id', (req, res) => {
    if (req.params.id === '1') {
        return res.send('User 1 - Admin');
    }
    res.send(`User ${req.params.id}`)
});

// Commits router
router.get('/', (req, res) => {
    res.json({ message: "Commits route works!" });
});

router.post('/', (req, res) => {
    res.json({ message: "POST request to /commits" });
});

router.get('/scores', (req, res) => {
    res.json({ message: "Scores route works!" });
});

app.use('/commits', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});