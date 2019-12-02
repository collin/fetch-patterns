import React from 'react';
import {Route, Link} from 'react-router-dom';

import ListThings from './list-things';
import ShowThing from './show-thing';
import CreateThing from './create-thing';
import EditThing from './edit-thing';

export default function App(props) {
  return (
    <>
      <h1>Hello! It is APP</h1>
      <main>
        <Route exact path="/" component={ListThings} />
        <Route exact path="/thing/:id" component={ShowThing}/>
        <Route exact path="/new-thing" component={CreateThing}/>
        <Route exact path="/edit-thing/:id" component={EditThing}/>
      </main>
    </>
  );
}
