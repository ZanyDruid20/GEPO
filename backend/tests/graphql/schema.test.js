// tests/graphql/schema.test.js
const typeDefs = require('../../graphql/schema');

describe('GraphQL Schema', () => {
  it('should define Language type with required fields', () => {
    const schemaString = typeDefs.loc.source.body;
    expect(schemaString).toContain('type Language {');
    expect(schemaString).toContain('language: String!');
    expect(schemaString).toContain('bytes: Int!');
    expect(schemaString).toContain('percentage: Float!');
  });

  it('should define WrappedReport type with all required fields', () => {
    const schemaString = typeDefs.loc.source.body;
    expect(schemaString).toContain('type WrappedReport {');
    expect(schemaString).toContain('username: String!');
    expect(schemaString).toContain('totalRepos: Int!');
    expect(schemaString).toContain('totalBytes: Int!');
    expect(schemaString).toContain('languages: [Language!]!');
    expect(schemaString).toContain('totalCommits: Int!');
    expect(schemaString).toContain('score: Int!');
  });

  it('should define LanguageBreakdown type', () => {
    const schemaString = typeDefs.loc.source.body;
    expect(schemaString).toContain('type LanguageBreakdown {');
    expect(schemaString).toContain('totalBytes: Int!');
  });

  it('should define CommitSummary type', () => {
    const schemaString = typeDefs.loc.source.body;
    expect(schemaString).toContain('type CommitSummary {');
    expect(schemaString).toContain('totalCommits: Int!');
    expect(schemaString).toContain('repoCount: Int!');
  });

  it('should define Score type', () => {
    const schemaString = typeDefs.loc.source.body;
    expect(schemaString).toContain('type Score {');
    expect(schemaString).toContain('score: Int!');
  });

  it('should define Query type with wrapped, languages, commits, and scores', () => {
    const schemaString = typeDefs.loc.source.body;
    expect(schemaString).toContain('type Query {');
    expect(schemaString).toContain('wrapped(username: String!): WrappedReport!');
    expect(schemaString).toContain('languages(username: String!): LanguageBreakdown!');
    expect(schemaString).toContain('commits(username: String!): CommitSummary!');
    expect(schemaString).toContain('scores(username: String!): Score!');
  });
});
