// @flow
import React, { type Node } from 'react'
import styled from 'styled-components'

const FieldsetContainer = styled.fieldset`
  border: 1px solid black;
  font-size: 1.3rem;
  padding: 25px 35px;
  
  &:not(:last-of-type) {
    border-bottom: none;
  }
`

const Legend = styled.span`
  display: block;
  font-weight: bold;
  margin-bottom: 24px;
`

type Props = {
  legend?: Node,
  children?: Node
}

export default function Fieldset ({ children, legend }: Props) {
  return (
    <FieldsetContainer>
      {legend && (
        <Legend>{legend}</Legend>
      )}
      {children}
    </FieldsetContainer>
  )
}
