// @flow
import React, { type Node } from 'react'
import styled from 'styled-components'
import { primary } from 'theme'

type Props = {
  children?: Node,
  title: Node
}

const HeaderContainer = styled.header`
  border-bottom: 1px solid ${primary};
  font-size: 2rem;
  font-weight: bold;
  padding: 13px 18px 13px 35px;
  width: 100%;
  
  .actions {
    float: right;
  }
  
  &::after {
    display: block;
    clear: both;
    content: "";
  }
`

export default function Header ({children, title}: Props) {
  return (
    <HeaderContainer>
      {title}
      <div className="actions">
        {children}
      </div>
    </HeaderContainer>
  )
}
