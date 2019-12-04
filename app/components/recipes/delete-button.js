import React, {useState} from 'react';
import useFetch from '../../util/use-fetch';

export default function DeleteRecipeButton(props) {
  const [deleted, setDeleted] = useState(false);
  const {inFlight: deleting, error, doFetch: deleteThisRecipe} = useFetch(
    `/api/recipes/${props.recipe.id}`,
    {method: 'DELETE'},
    {
      afterFetch: () => {
        setDeleted(true);
        props.afterDelete && props.afterDelete();
      },
    },
  );
  return (
    <button onClick={deleteThisRecipe} disabled={deleting || deleted}>
      {deleted === false && (
        <>
          {deleting ? '⏳' : '🗑'}
          {error && '🚨 (click to retry)'}
        </>
      )}
      {deleted === true && '⏳'}
    </button>
  );
}
