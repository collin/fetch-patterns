const {createNiceSequelizeLoggerConfig} = require('nice-sequelize-logger');

const niceLoggerConfig = createNiceSequelizeLoggerConfig();
const Sequelize = require('sequelize');
const db = new Sequelize(`postgres://localhost:5432/recipes-fetch-patterns`, {
  ...niceLoggerConfig,
});

const Recipe = db.define('recipes', {
  name: Sequelize.STRING,
});

const Ingredient = db.define('ingredients', {
  name: Sequelize.STRING,
})

const RecipeIngredients = db.define('recipe_ingredients', {
  units: Sequelize.STRING,
})

Recipe.belongsToMany(Ingredient, { through: RecipeIngredients });
Ingredient.belongsToMany(Recipe, { through: RecipeIngredients });

const express = require('express');
const app = express();
const volleyball = require('volleyball');
app.use(volleyball);
app.use(express.json());

const Bundler = require('parcel-bundler');

const bundler = new Bundler('app/index.html');

app.get('/api/recipes', async (req, res, next) => {
  try {
    res.json(await Recipe.findAll());
  } catch (error) {
    next(error);
  }
});

app.get('/api/recipes/:id', async (req, res, next) => {
  try {
    res.json(await Recipe.findByPk(req.params.id));
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

app.post('/api/recipes', async (req, res, next) => {
  try {
    res.json(await Recipe.create(req.body));
  } catch (error) {
    next(error);
  }
});

app.put('/api/recipes/:id', async (req, res, next) => {
  try {
    const [count, [updatedRecipe]] = await Recipe.update(req.body, {
      where: {id: req.params.id},
      returning: true
    });
    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/recipes/:id', async (req, res, next) => {
  try {
    await Recipe.destroy({where: {id: req.params.id}});
    res.status(204).send(await Recipe.findAll());
  } catch (error) {
    next(error);
  }
});

app.get('/api/ingredients', async (req, res, next) => {
  try {
    res.json(await Ingredient.findAll());
  } catch (error) {
    next(error);
  }
});

app.get('/api/ingredients/:id', async (req, res, next) => {
  try {
    res.json(await Ingredient.findByPk(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.post('/api/ingredients', async (req, res, next) => {
  try {
    res.json(await Ingredient.create(req.body));
  } catch (error) {
    next(error);
  }
});

app.put('/api/ingredients/:id', async (req, res, next) => {
  try {
    const [count, [updatedIngredient]] = await Ingredient.update(req.body, {
      where: {id: req.params.id},
      returning: true
    });
    res.json(updatedIngredient);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/ingredients/:id', async (req, res, next) => {
  try {
    await Ingredient.destroy({where: {id: req.params.id}});
    res.status(204).send(await Ingredient.findAll());
  } catch (error) {
    next(error);
  }
});
app.use(bundler.middleware());

async function seedDatabase() {
  await Recipe.create({name: 'Recipe 1'});
  await Recipe.create({name: 'Recipe 2'});
  await Recipe.create({name: 'A Third Recipe'});
  await Recipe.create({name: 'There are four recipes!'});
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
