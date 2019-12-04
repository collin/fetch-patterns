const {createNiceSequelizeLoggerConfig} = require('nice-sequelize-logger');

const niceLoggerConfig = createNiceSequelizeLoggerConfig();
const Sequelize = require('sequelize');
const db = new Sequelize(`postgres://localhost:5432/fetch-patterns`, {
  ...niceLoggerConfig,
});

const Recipe = db.define('recipes', {
  name: Sequelize.STRING,
});

const Ingredient = db.define('ingredients', {
  name: Sequelize.STRING,
});

const Measures = db.define('measures', {
  amount: Sequelize.STRING,
});

Recipe.hasMany(Measures);
Measures.belongsTo(Ingredient);
Measures.belongsTo(Recipe);

//Ingredient.belongsToMany(Recipe, {through: Measures});
//Recipe.belongsToMany(Ingredient, {through: Measures});

const express = require('express');
const app = express();
const volleyball = require('volleyball');
app.use(volleyball);
app.use(express.json());

const Bundler = require('parcel-bundler');

const bundler = new Bundler('app/index.html');

const PER_PAGE = 1;
app.get('/api/recipes', async (req, res, next) => {
  const page = req.query.page || 1;
  const categoryFilter = req.query.category;
  const ingredientSearch = req.query.ingredient;

  console.log('QUERY', JSON.stringify(req.query, null, 2));
  const ingredientWhere = {};
  const ingredientOn = {}
  if (ingredientSearch) {
    ingredientWhere.name = {
      [Sequelize.Op.iLike]: `%${ingredientSearch}%`,
    };
  }

  try {
    res.json(
      await Recipe.findAll({
        order: [['id', 'asc']],
        limit: PER_PAGE,
        offset: (page - 1) * PER_PAGE,
        attributes: ['id', 'name'],
        include: [
          {
            model: Measures,
            attributes: ['id', 'amount'],
            order: [['id', 'asc']],
            include: [
              {
                right: true,
                model: Ingredient,
                attributes: ['id', 'name'],
                where: ingredientWhere,
              },
            ],
          },
        ],
      }),
    );
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
      returning: true,
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
      returning: true,
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

app.use('/api', (req, res, next) => {
  res.sendStatus(404);
});

app.use(bundler.middleware());

async function seedDatabase() {
  await db.sync({force: true});
  const recipes = Object.values(require('./data/recipes.json'));
  for (let recipe of recipes) {
    const recipeRecord = await Recipe.create({
      name: recipe.name,
    });
    for (let ingredient of recipe.ingredients) {
      const [ingredientRecord, created] = await Ingredient.findOrCreate({
        where: {name: ingredient.name},
      });
      try {
        await Measures.create({
          recipeId: recipeRecord.id,
          ingredientId: ingredientRecord.id,
          amount: ingredient.measure,
        });
      } catch (error) {
        // ignore unique errors
      }
    }
  }
}

async function main() {
  process.env.RESEED && (await seedDatabase());
  app.listen(4444, () => {
    process.env.LOG_SQL_STATEMENTS = true;
    console.log('Server is started on port 4444');
  });
}
main();
