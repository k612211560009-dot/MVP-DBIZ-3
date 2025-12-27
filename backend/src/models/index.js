const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const config = require("../../config/config");

const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]);

const db = {};

// Load all model files dynamically
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== "index.js" &&
      file !== "testConnection.js" &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// Setup associations between models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
