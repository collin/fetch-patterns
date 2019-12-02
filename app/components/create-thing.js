import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import useFetch from '../util/use-fetch';
import useInput from '../util/use-input';

export default function CreateThing(props) {
  const name = useInput({name: 'name', type: 'text'});
  const history = useHistory();

  const {inFlight: saving, error, doFetch: postThing} = useFetch(
    '/api/things',
    {
      method: 'POST',
    },
    {afterFetch: thing => history.push(`/thing/${thing.id}`)},
  );
  function createThing(event) {
    event.preventDefault();
    postThing({body: {name: name.value}});
  }
  return (
    <>
      <Link to="/">Back to list</Link>
      <form onSubmit={createThing}>
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
