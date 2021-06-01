import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Search from './pages/Search';
import Info from './pages/Info';

function Routes(){
    return (
        <Switch>
            <Route path="/" exact component={Search} />
            <Route path="/info/:id" component={Info} />
        </ Switch>
    );
}

export default Routes;