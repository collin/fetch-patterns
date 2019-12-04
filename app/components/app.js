import React from 'react';
import {Route, Link} from 'react-router-dom';

import ListRecipes from './recipes/list';
import ShowRecipe from './recipes/show';
import CreateRecipe from './recipes/create';
import EditRecipe from './recipes/edit';

export default function App(props) {
  return (
    <>
      <h1>Hello! It is APP</h1>
      <main>
        <Route exact path="/" component={ListRecipes} />
        <Route exact path="/recipe/:id" component={ShowRecipe}/>
        <Route exact path="/new-recipe" component={CreateRecipe}/>
        <Route exact path="/edit-recipe/:id" component={EditRecipe}/>
      </main>
    </>
  );
}
