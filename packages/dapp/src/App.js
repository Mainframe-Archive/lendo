// @flow
import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import { createGlobalStyle } from 'styled-components'

import Sidebar from 'ui/Sidebar'

import {
  Dashboard,
  Loaned,
  Borrowed,
  Requests,
  NewLoan,
} from 'pages'

import { defaultFontFamily, defaultFontSize, defaultTextColor } from 'theme'

const GlobalStyles = createGlobalStyle`
  html {
    font-size: ${defaultFontSize};
  }

  body {
    background-color: white;
    margin: 0;
    font-family: ${defaultFontFamily};
    color: ${defaultTextColor};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  #root {
    display: flex;
    height: 100vh;
  }
`
export default function App () {
  return (
    <Router>
     <GlobalStyles />
     <Switch>
       <Route exact path="/new-loan" component={NewLoan} />
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
