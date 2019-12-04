import React from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import useFetch from '../../util/use-fetch';
import DeleteRecipeButton from './delete-button';

export default function ShowRecipe(props) {
  const {id} = useParams();
  const history = useHistory();
  const {data: recipe, inFlight, error, doFetch: retry} = useFetch(
    `/api/recipes/${id}`,
  );
  return (
    <>
      <Link to="/">Back to List</Link>
      {inFlight && <h1>Loading ...⏳</h1>}
      {error && (
        <>
          <h1>🚨 Error while fetching recipe with id {id}</h1>
          <button onClick={retry}>Re-try.</button>
        </>
      )}
      {recipe && (
        <>
          <h1>Look at this recipe:</h1>
          <h2>{recipe.name}</h2>
          <Link to={`/edit-recipe/${recipe.id}`}>Edit ✏️</Link>
          <DeleteRecipeButton
            recipe={recipe}
            afterDelete={() => history.push('/')}
          />
        </>
      )}
    </>
  );
}
