import React, {useState, useEffect} from 'react';

const idempotentMethods = new Set(['GET', 'OPTIONS', 'HEAD']);

export default function useFetch(url, fetchOptions = {}, options = {}) {
  fetchOptions.method || (fetchOptions.method = 'GET');
  const shouldFetchImmediately = options.fetchNow === true || idempotentMethods.has(fetchOptions.method);
  const [inFlight, setInFlight] = useState(shouldFetchImmediately);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(shouldFetchImmediately ? 1 : 0);
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
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setData(data);
        }
        setInFlight(false);
        options.afterFetch && options.afterFetch();
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
    // It is very nice to write components like this:
    //  <button onClick={doFetch}>
    //
    // But this creates a problem as the react synthetic event is passed in
    // as the first argument, and that is not what we want.
    //
    // One solution is:
    //  <button onClick={() => doFetch()}>
    //
    // But that is a cruel burden, so this function checks if the argument is
    // a React synthetic event, and short-circuits that argument.
    //
    // Also: I would MUCH rather do an actual type-check here:
    // if (extraFetchOptions instanceof React.SyntheticEvent) {
    // But I cannot figure out how to import that constructor :(
    if (extraFetchOptions.hasOwnProperty('nativeEvent')) {
      extraFetchOptions = {}
    }
    setExtraFetchOptions(extraFetchOptions);
    setFetchTrigger(count => count + 1);
  }

  return {data, inFlight, error, doFetch};
}
