import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Bpmn from './routes/Bpmn';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Bpmn} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
