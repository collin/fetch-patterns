import {useState, useEffect} from 'react';

export default function useFetch(url, fetchOptions = {}, options = {}) {
  const [inFlight, setInFlight] = useState(!(options.fetchNow === false));
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [abortController, setAbortController] = useState(new AbortController());

  async function doFetch(extraFetchOptions) {
    try {
      // TODO: figure out how to cancel the last request while making the next
      //abortController.abort();
      setInFlight(true);
      setError(null);
      const request = window.fetch(url, {
        ...fetchOptions,
        ...extraFetchOptions,
        //signal: abortController.signal
      });
      const response = await request;
      const data = await response.json();
      setData(data);
      setInFlight(false);
    } catch (error) {
      //if (error.message.match(/aborted/)) return
      setInFlight(false);
      setError(error);
      setData(null);
    }
  }

  useEffect(() => {
    if (options.fetchNow === false) return;
    doFetch();
  }, [url, options.fetchNow]);

  return {data, inFlight, error, doFetch};
}
