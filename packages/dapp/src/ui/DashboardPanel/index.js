// @flow
import React from 'react'
import styled from 'styled-components'
import { primary } from 'theme'

const Container = styled.div`
  border: 1px solid ${primary};
  color: ${primary};
  font-size: 2.4rem;
  font-weight: 600;
  padding: 14px 18px;
  
  .label {
    font-size: 1rem;
    display: block;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
`

type Props = {
  label?: Node,
  children?: Node,
}

export default function DashboardPanel({ label, children }: Props) {
  return (
    <Container>
      <span className="label">
        {label}
      </span>
      {children}
    </Container>
  )
}
