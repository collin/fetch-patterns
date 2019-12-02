import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import useFetch from '../util/use-fetch';
import DeleteThingButton from './delete-thing-button';

export default function ListThings(props) {
  const {data: things, inFlight, error, doFetch: refetchList} = useFetch(
    '/api/things',
  );
  const {inFlight: seedingInFlight, doFetch: reseedDatabase} = useFetch(
    '/api/seed',
    {method: 'POST'},
    {afterFetch: refetchList},
  );
  return (
    <>
      <nav>
        <Link to="/new-thing">Make a New Thing</Link>
      </nav>
      <button
        disabled={seedingInFlight}
        onClick={async () => {
          reseedDatabase();
        }}>
        Re-seed Database
        {inFlight && '⏳'}
      </button>
      <h1>lookat these things!</h1>
      {inFlight && <p className="info">Loading things...</p>}
      {error && <p className="error">Error fetching things: {error.message}</p>}
      {things && things.length === 0 && (
        <p className="info">There aren't any things</p>
      )}
      {things && things.length > 0 && (
        <ul>
          {things.map(thing => (
            <li key={thing.id}>
              <ThingInList thing={thing} afterDelete={refetchList} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ThingInList(props) {
  return (
    <>
      <Link to={`/thing/${props.thing.id}`}><p>{props.thing.name}</p></Link>
      <Link to={`/edit-thing/${props.thing.id}`}><p>Edit ✏️</p></Link>
      <DeleteThingButton thing={props.thing} afterDelete={props.afterDelete}/>
    </>
  );
}
