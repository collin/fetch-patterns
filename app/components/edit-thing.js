import React from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import useFetch from '../util/use-fetch';
import useInput from '../util/use-input';

export default function EditThing(props) {
  const {id} = useParams();
  const {inFlight, error, data: thing, doFetch: retry} = useFetch(
    `/api/things/${id}`,
  );

  return (
    <>
      <Link to={`/thing/${id}`}>Back to thing</Link>
      {error && (
        <>
          🚨 Error loading <button retry={retry}>Retry</button>
        </>
      )}
      {inFlight && 'Loading... ⏳'}
      {thing && <EditThingForm thing={thing}/>}
    </>
  );
}

function EditThingForm (props) {
  const name = useInput({name: 'name', type: 'text', value: props.thing.name});
  const history = useHistory();
  const {inFlight: saving, error, doFetch: putThing} = useFetch(
    `/api/things/${props.thing.id}`,
    {
      method: 'PUT',
    },
    {afterFetch: thing => history.push(`/thing/${thing.id}`)},
  );
  function updateThing(event) {
    event.preventDefault();
    putThing({body: {name: name.value}});
  }
  return (
    <>
      <Link to="/">Back to list</Link>
      <form onSubmit={updateThing}>
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
