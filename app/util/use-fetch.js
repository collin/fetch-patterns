import {useState, useEffect} from 'react';

export default function useFetch(url, fetchOptions = {}, options = {}) {
  const [inFlight, setInFlight] = useState(!(options.fetchNow === false));
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(options.fetchNow === false ? 0 : 1);
  const [extraFetchOptions, setExtraFetchOptions] = useState({});

  useEffect(() => {
    if (fetchTrigger === 0) return

    const abortController = new AbortController();
    let aborted = false;
    async function executeFetch() {
      try {
        setInFlight(true);
        setError(null);
        const request = window.fetch(url, {
          ...fetchOptions,
          ...extraFetchOptions,
          signal: abortController.signal
        });
        const response = await request;
        const data = await response.json();
        setData(data);
        setInFlight(false);
      } catch (error) {
        setInFlight(false);
        if (aborted === false) {
          setError(error);
          setData(null);
        }
      }
    }
    executeFetch();

    return () => {
      aborted = true;
      abortController.abort();
    }
  }, [url, fetchTrigger])

  function doFetch (extraFetchOptions={}) {
    setExtraFetchOptions(extraFetchOptions);
    setFetchTrigger(count => count + 1);
  }

  return {data, inFlight, error, doFetch};
}
