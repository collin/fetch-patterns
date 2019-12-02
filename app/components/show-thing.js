import React from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import useFetch from '../util/use-fetch';
import DeleteThingButton from './delete-thing-button';

export default function ShowThing(props) {
  const {id} = useParams();
  const history = useHistory();
  const {data: thing, inFlight, error, doFetch: retry} = useFetch(
    `/api/things/${id}`,
  );
  return (
    <>
      <Link to="/">Back to List</Link>
      {inFlight && <h1>Loading ...⏳</h1>}
      {error && (
        <>
          <h1>🚨 Error while fetching thing with id {id}</h1>
          <button onClick={retry}>Re-try.</button>
        </>
      )}
      {thing && (
        <>
          <h1>Look at this thing:</h1>
          <h2>{thing.name}</h2>
          <Link to={`/edit-thing/${thing.id}`}>Edit ✏️</Link>
          <DeleteThingButton
            thing={thing}
            afterDelete={() => history.push('/')}
          />
        </>
      )}
    </>
  );
}
