import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import useFetch from '../../util/use-fetch';
import DeleteRecipeButton from './delete-button';

export default function ListRecipes(props) {
  const {data: recipes, inFlight, error, doFetch: refetchList} = useFetch(
    '/api/recipes',
  );
  const {inFlight: seedingInFlight, doFetch: reseedDatabase} = useFetch(
    '/api/seed',
    {method: 'POST'},
    {afterFetch: refetchList},
  );
  return (
    <>
      <nav>
        <Link to="/new-recipe">Make a New Recipe</Link>
      </nav>
      <button
        disabled={seedingInFlight}
        onClick={async () => {
          reseedDatabase();
        }}>
        Re-seed Database
        {inFlight && '⏳'}
      </button>
      <h1>lookat these recipes!</h1>
      {inFlight && <p className="info">Loading recipes...</p>}
      {error && <p className="error">Error fetching recipes: {error.message}</p>}
      {recipes && recipes.length === 0 && (
        <p className="info">There aren't any recipes</p>
      )}
      {recipes && recipes.length > 0 && (
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <RecipeInList recipe={recipe} afterDelete={refetchList} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function RecipeInList(props) {
  return (
    <>
      <Link to={`/recipe/${props.recipe.id}`}><p>{props.recipe.name}</p></Link>
      <Link to={`/edit-recipe/${props.recipe.id}`}><p>Edit ✏️</p></Link>
      <DeleteRecipeButton recipe={props.recipe} afterDelete={props.afterDelete}/>
    </>
  );
}
