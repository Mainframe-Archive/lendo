// @flow
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'

import Sidebar from './ui/Sidebar'

import Dashboard from './pages/Dashboard'
import Loaned from './pages/Loaned'
import Borrowed from './pages/Borrowed'
import Requests from './pages/Requests'
import { defaultFontFamily, defaultFontSize, defaultTextColor } from './theme'

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${defaultFontFamily};
    font-size: ${defaultFontSize};
    color: ${defaultTextColor};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

export default function App() {
  return (
    <Router>
      <GlobalStyles />
      <Sidebar />
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/loaned" component={Loaned} />
        <Route path="/borrowed" component={Borrowed} />
        <Route path="/loaned" component={Loaned} />
        <Route path="/requests" component={Requests} />
      </Switch>
    </Router>
  )
}
