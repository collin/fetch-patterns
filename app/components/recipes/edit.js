import React from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import useFetch from '../../util/use-fetch';
import useInput from '../../util/use-input';

export default function EditRecipe(props) {
  const {id} = useParams();
  const {inFlight, error, data: recipe, doFetch: retry} = useFetch(
    `/api/recipes/${id}`,
  );

  return (
    <>
      <Link to={`/recipe/${id}`}>Back to recipe</Link>
      {error && (
        <>
          🚨 Error loading <button retry={retry}>Retry</button>
        </>
      )}
      {inFlight && 'Loading... ⏳'}
      {recipe && <EditRecipeForm recipe={recipe}/>}
    </>
  );
}

function EditRecipeForm (props) {
  const name = useInput({name: 'name', type: 'text', value: props.recipe.name});
  const history = useHistory();
  const {inFlight: saving, error, doFetch: putRecipe} = useFetch(
    `/api/recipes/${props.recipe.id}`,
    {
      method: 'PUT',
    },
    {afterFetch: recipe => history.push(`/recipe/${recipe.id}`)},
  );
  function updateRecipe(event) {
    event.preventDefault();
    putRecipe({body: {name: name.value}});
  }
  return (
    <>
      <Link to="/">Back to list</Link>
      <form onSubmit={updateRecipe}>
        {error && (
          <>
            <p className="error">🚨{error.message}</p>
          </>
        )}
        <div>
          <label htmlFor="name">Name:</label>
          <input {...name} />
        </div>
        <button disabled={saving}>Save {saving && '⏳'}</button>
      </form>
    </>
  );
}
