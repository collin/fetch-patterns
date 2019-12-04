import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import useFetch from '../../util/use-fetch';
import useInput from '../../util/use-input';

export default function CreateRecipe(props) {
  const name = useInput({name: 'name', type: 'text'});
  const history = useHistory();

  const {inFlight: saving, error, doFetch: postRecipe} = useFetch(
    '/api/recipes',
    {
      method: 'POST',
    },
    {afterFetch: recipe => history.push(`/recipe/${recipe.id}`)},
  );
  function createRecipe(event) {
    event.preventDefault();
    postRecipe({body: {name: name.value}});
  }
  return (
    <>
      <Link to="/">Back to list</Link>
      <form onSubmit={createRecipe}>
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
