import React from 'react';
import {Route} from 'react-router-dom';
import ListThings from './list-things';

export default function App(props) {
  return (
    <>
      <h1>Hello! It is APP</h1>
      <Route exact path="/" component={ListThings} />
    </>
  );
}
