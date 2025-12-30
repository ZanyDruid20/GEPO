// Import the GraphQL for express.js
// GraphQL schema (CommonJS)
const { gql } = require('apollo-server-express');

// Define the GraphQL schema
const typeDefs = gql`
    type Language {
        language: String!
        bytes: Int!
        percentage: Float!
    }
    type LanguageBreakdown {
        username: String!
        totalRepos: Int!
        totalBytes: Int!
        languages: [Language!]!
    }
    type CommitSummary {
        username: String!
        totalCommits: Int!
        repoCount: Int!
    }
    type Score {
        username: String!
        totalRepos: Int!
        score: Int!
    }
    type WrappedReport {
        username: String!
        totalRepos: Int!
        totalBytes: Int!
        languages: [Language!]!
        totalCommits: Int!
        score: Int!
    }
    type Query {
        commits(username: String!): CommitSummary!
        languages(username: String!): LanguageBreakdown!
        scores(username: String!): Score!
        wrapped(username: String!): WrappedReport!
    }
    `;
module.exports = typeDefs;