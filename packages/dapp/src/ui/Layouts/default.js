// @flow
import React, { type Node } from 'react'
import styled from 'styled-components'
import Header from 'ui/Header'

const Main = styled.main`
  flex: 1;
  
  .layout-body {
    padding: 32px 35px;
  }
`

type Props = {
  title: Node,
  children?: Node
}

export default function DefaultLayout ({ children, title }: Props) {
  return (
    <Main>
      <Header title={title} />
      <div className="layout-body">
        {children}
      </div>
    </Main>
  )
}
