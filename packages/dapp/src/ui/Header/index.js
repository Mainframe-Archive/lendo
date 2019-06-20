// @flow
import React, { type Node } from 'react'
import styled from 'styled-components'

type Props = {
  children: Node,
  title: Node
}

const HeaderContainer = styled.header`
  border-bottom: 1px solid #232323;
  font-size: 2rem;
  font-weight: bold;
  padding: 13px 18px 13px 35px;
  width: 100%;
  
  .actions {
    float: right;
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
