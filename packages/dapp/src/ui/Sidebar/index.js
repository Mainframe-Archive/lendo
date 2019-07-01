// @flow
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { defaultTextColor } from 'theme'
import triangle from './triangle.svg'
import LinkButton from '../LinkButton'

const SidebarContainer = styled.aside`
  background-color: #f9f9f9;
  font-size: 1rem;
  padding: 20px 5px 20px 30px;
  overflow: none;
  width: 200px;

  nav {
    font-size: 1.3rem;
  }

  ul {
    padding-left: 20px;
    list-style: url(${triangle});
  }

  li {
    margin-bottom: 15px;
  }

  a {
    color: ${defaultTextColor};
    text-decoration: none;

    &.active {
      font-weight: bold;
    }
  }
  
  .create-loan-btn {
    display: block;
    margin-bottom: 50px;
  }
`

export default function Sidebar() {
  return (
    <SidebarContainer>
      <LinkButton to="/new-loan" className="create-loan-btn" primary>
        Create Loan
      </LinkButton>

      Pages
      <nav>
        <ul>
          <li>
            <NavLink to="/" activeClassName="active" exact>
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
    </SidebarContainer>
  )
}
