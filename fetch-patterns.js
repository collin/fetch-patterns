function ListThings(props) {
  const {data: things, loading, error} = useFetch('/things');
  if (error) {
    return <p className="error">Error loading things.</p>;
  }
  if (loading) {
    return <p className="info">Loading things...</p>;
  }
  if (things.length === 0) {
    return <p className="info">There aren't any things.</p>;
  }
  return (
    <>
      <h1>Look at all these things!</h1>
      <ol>
        {things.map(thing => (
          <li key={thing.id}>It's a thing named {thing.name}</li>
        ))}
      </ol>
    </>
  );
}

function ShowThing(props) {
  const {data: thing, loading, error} = useFech(`/things/${props.thingId}`);
  if (error) {
    return (
      <p className="error">Error loading thing with id {props.thingId}.</p>
    );
  }
  if (loading) {
    return <p className="info">Loading thing with id {props.thingId}.</p>;
  }
  return (
    <>
      <h1>Look at THIS thing: {thing.name}</h1>
      <p>{thing.description}</p>
    </>
  );
}

function useFetch(url, fetchOptions = {}) {
  const [response, setResponse] = useState(null);
  const [inFlight, setInFlight] = useState(false);
  const [error, setError] = useState(null);
  async function exec(fetchOptionsOverrides = {}) {
    try {
      setError(null);
      setInFlight(true);
      const request = fetch(url, {...fetchOptionsi, ...fetchOptionsOverrides});
      const response = await request;
      const data = await response.json();
      setInFlight(false);
      setResponse(data);
    } catch (error) {
      setInFlight(false);
      setResponse(null);
      setError(error);
    }
  }
  return {
    response,
    inFlight,
    error,
    exec,
  };
}

function useResource(url, options = {}) {
  const get = useResource(url, {...options.fetchOptions, method: 'GET'});
  const post = useResource(url, {...options.fetchOptions, method: 'POST'});
  const put = useResource(url, {...options.fetchOptions, method: 'PUT'});
  const del = useResource(url, {...options.fetchOptions, method: 'DELETE'});

  useEffect(() => {
    if (options.fetchNow === false) {
      return;
    }
    get.exec();
  }, [url]);

  return {
    execGet: get.exec,
    getResponse: get.response,
    getInFlight: get.inFlight,
    getError: get.error,

    execPost: post.exec,
    postResponse: post.response,
    postInFlight: post.inFlight,
    postError: post.error,

    execPut: put.exec,
    putResponse: put.response,
    putInFlight: put.inFlight,
    putError: put.error,

    execDelete: del.exec,
    delResponse: del.response,
    delInFlight: del.inFlight,
    delError: del.error,
  };
}

function EditThing(props) {
  const {
    execGet: getThing,
    getResponse: thing,
    getInFlight,
    getError,

    execPut: updateThing,
    putResponse: updatedThing,
    putInFlight,
    putError,
  } = useResource(`/things/${props.thingId}`);

  const history = useHistory();

  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    if (thing) {
      setName(thing.name);
      setDescription(thing.description);
    }
  }, [thing]);

  useEffect(() => {
    if (updatedThing) {
      history.push(`/things/${updatedThing.id}`);
    }
  }, [updatedThing]);

  if (getInFlight) return <p>Loading...</p>;
  if (getError) return <p>Error!</p>;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        updateThing({body: {name, description}});
      }}>
      {putError && (
        <>
          <p className="error">
            There were errors while saving this thing: {putError.message}
          </p>
        </>
      )}
      <div>
        <label>Name</label>
        <input
          required
          name="name"
          value={name}
          onChange={event => setName(event.target.value)}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          required
          name="description"
          value={description}
          onChange={event => setDescription(event.target.value)}
        />
      </div>
      <button disabled={putInFlight}>
        {putInFlight ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

const EditThing = props => {
  const {data: thing, loading, error} = useFetch(`/things/${props.thingId}`);
  if (loading || error) return 'Loading... (or error)';
  return <ThingForm key={thing.id} thing={thing} />;
};
const ThingForm = props => {
  const [name, setName] = useState(props.thing.name);
  const [description, setDescription] = useState(props.thing.description);

  const {data: updatedThing, loading, error, doFetch} = useFetch(
    `/things/${props.thing.id}`,
    {
      method: 'PUT',
    },
    {
      wait: true,
    },
  );

  function createThing(event) {
    event.preventDefault();
    doFetch({
      body: {name, description},
    });
  }

  return (
    <form onSubmit={createThing}>
      {error && <p className="error">{error.message}</p>}
      <input value={name} onChange={e => setName(e.target.value)} />
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
};
