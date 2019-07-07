// @flow
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import GlobalStyles from 'styles'
import Sidebar from 'ui/Sidebar'
import {
  Dashboard,
  Loaned,
  Borrowed,
  Requests,
  NewLoanSetup,
  NewLoanReview,
} from 'pages'

export default function App() {
  return (
    <Router>
      <GlobalStyles />
      <Switch>
        <Route exact path="/new-loan/setup" component={NewLoanSetup} />
        <Route exact path="/new-loan/review" component={NewLoanReview} />
        <Route>
          <Sidebar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/loaned" component={Loaned} />
            <Route path="/borrowed" component={Borrowed} />
            <Route path="/requests" component={Requests} />
            <Redirect to="/" />
          </Switch>
        </Route>
      </Switch>
    </Router>
  )
}
