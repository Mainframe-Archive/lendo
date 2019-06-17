// @flow
import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside>
      Pages
      <nav>
        <ul>
          <li>
            <NavLink to="/" activeClassName="active">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/loaned" activeClassName="active">
              Loaned
            </NavLink>
          </li>
          <li>
            <NavLink to="/borrowed" activeClassName="active">
              Borrowed
            </NavLink>
          </li>
          <li>
            <NavLink to="/requests" activeClassName="active">
              Requests
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
