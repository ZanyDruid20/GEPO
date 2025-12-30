require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('../config/passport');
const { connectDB } = require('../config/mongo');
const { limiter } = require('../middleware/rateLimit_middleware');
const { errorHandler } = require('../middleware/error_middleware');
const { refreshTokenIfNeeded } = require('../middleware/tokenRefresh_middleware');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../graphql');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(limiter); // Rate limit all requests
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(refreshTokenIfNeeded); // Check token validity

// Routes
const authRoutes = require('../routes/auth');
const languagesRoutes = require('../routes/languages');
const commitsRoutes = require('../routes/commits');
const scoresRoutes = require('../routes/scores');
const wrappedRoutes = require('../routes/wrapped');

app.use('/api/auth', authRoutes);
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
  server.applyMiddleware({ app, path: '/graphql' });
}

startApolloServer();

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;