require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('../config/passport');
const { connectDB } = require('../config/mongo');
const { limiter } = require('../middleware/rateLimit_middleware');
const { errorHandler } = require('../middleware/error_middleware');
const { refreshTokenIfNeeded } = require('../middleware/tokenRefresh_middleware');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../graphql');
const { getCacheStats, resetCacheStats } = require('../utils/cache');
const rateLimit = require('express-rate-limit');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://gepo-f4t5.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
const isProd = process.env.NODE_ENV === 'production';

// Debug routes (dev only, with relaxed rate limit)
const debugLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Allow 1000 requests per minute for testing
  skip: (req) => process.env.NODE_ENV !== 'production' // Skip rate limit in dev
});

if (!isProd) {
  app.get('/api/debug/cache-stats', debugLimiter, (req, res) => {
    const stats = getCacheStats();
    const total = stats.hits + stats.misses;
    const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(2) : 'N/A';
    res.json({ ...stats, total, hitRate: `${hitRate}%` });
  });

  app.post('/api/debug/cache-reset', debugLimiter, (req, res) => {
    resetCacheStats();
    res.json({ message: 'Cache stats reset' });
  });
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // Use Lax in dev (allowed for same-site ports like localhost:3000↔4000) and Secure+None in prod.
  cookie: isProd
    ? { httpOnly: true, sameSite: 'none', secure: true }
    : { httpOnly: true, sameSite: 'lax', secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(refreshTokenIfNeeded); // Check token validity
app.use(limiter); // Rate limit all other requests

// Routes
const authRoutes = require('../routes/auth');
const tokenRoutes = require('../routes/token');
const languagesRoutes = require('../routes/languages');
const commitsRoutes = require('../routes/commits');
const scoresRoutes = require('../routes/scores');
const wrappedRoutes = require('../routes/wrapped');

app.use('/api/auth', authRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/languages', languagesRoutes);
app.use('/api/commits', commitsRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/wrapped', wrappedRoutes);

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: ['http://localhost:3000', 'https://gepo-f4t5.vercel.app'],
      credentials: true,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  });
}

startApolloServer();

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;