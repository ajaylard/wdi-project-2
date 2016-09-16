module.exports = {
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost/michelin',
  secret: process.env.SECRET || "secret"
};
