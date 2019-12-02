const { createNiceSequelizeLoggerConfig } = require("nice-sequelize-logger");

const niceLoggerConfig = createNiceSequelizeLoggerConfig();
const Sequelize = require('sequelize');
const db = new Sequelize(`postgres://localhost:5432/things-fetch-patterns`, {
  ...niceLoggerConfig
});

const Thing = db.define('things', {
  name: Sequelize.STRING,
});

const express = require('express');
const app = express();
const volleyball = require('volleyball');
app.use(volleyball);

const Bundler = require('parcel-bundler');

const bundler = new Bundler('app/index.html');

app.get('/api/things', async (req, res, next) => {
  try {
    res.json(await Thing.findAll());
  } catch (error) {
    next(error);
  }
});

app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

app.post('/api/things', (req, res, next) => {
  Thing.create(req.body)
    .then(res.json)
    .catch(next);
});

app.put('/api/things/:id', (req, res, next) => {
  Thing.update(req.body, {where: {id: req.params.id}})
    .then(res.json)
    .catch(next);
});

app.delete('/api/things/:id', async (req, res, next) => {
  try {
    await Thing.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.use(bundler.middleware());

async function seedDatabase() {
  await Thing.create({name: 'Thing 1'});
  await Thing.create({name: 'Thing 2'});
  await Thing.create({name: 'A Third Thing'});
  return await Thing.create({name: 'There are four things!'});
}

async function main() {
  await db.sync({force: true});
  await seedDatabase();
  app.listen(4444, () => {
    process.env.LOG_SQL_STATEMENTS = true;
    console.log('Server is started on port 4444');
  });
}
main();
