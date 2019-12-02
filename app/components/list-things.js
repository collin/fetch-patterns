import React, {useState} from 'react';
import useFetch from '../util/use-fetch';

export default function ListThings(props) {
  const {data: things, inFlight, error, doFetch: refetchList} = useFetch(
    '/api/things',
  );
  const {inFlight: seedingInFlight, doFetch: reseedDatabase} = useFetch('/api/seed', { method: 'POST' });
  return (
    <>
      <button
        disabled={seedingInFlight}
        onClick={async () => {
          await reseedDatabase();
          await refetchList();
        }}>
        Re-seed Database
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
  const [deleted, setDeleted] = useState(false);
  const {inFlight: deleting, error, doFetch} = useFetch(
    `/api/things/${props.thing.id}`,
    {method: 'DELETE'},
    {fetchNow: false},
  );
  async function deleteThisThing() {
    await doFetch();
    setDeleted(true);
    props.afterDelete && props.afterDelete();
  }
  return (
    <>
      <p>{props.thing.name}</p>
      <button onClick={deleteThisThing} disabled={deleting || deleted}>
        {deleted === false && (
          <>
            {deleting ? '⏳' : '🗑'}
            {error && '🚨 (click to retry)'}
          </>
        )}
        {deleted === true && '⏳'}
      </button>
    </>
  );
}
