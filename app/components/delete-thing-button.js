import React, {useState} from 'react';
import useFetch from '../util/use-fetch';

export default function DeleteThingButton(props) {
  const [deleted, setDeleted] = useState(false);
  const {inFlight: deleting, error, doFetch: deleteThisThing} = useFetch(
    `/api/things/${props.thing.id}`,
    {method: 'DELETE'},
    {
      afterFetch: () => {
        setDeleted(true);
        props.afterDelete && props.afterDelete();
      },
    },
  );
  return (
    <button onClick={deleteThisThing} disabled={deleting || deleted}>
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
