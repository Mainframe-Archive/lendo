// @flow
import React from 'react'
import styled from 'styled-components'
import { primary, gray } from 'theme'

const Container = styled.div`
  input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid ${gray};
    font-size: 1.8rem;
    padding-bottom: 5px;
    transition: 200ms;
    width: 100%;
    
    &:focus {
      outline: none;
      border-bottom-color: ${primary};
    }
  }
`

type Props = {
  value: string,
  required?: boolean,
  onChange: (data: string) => void
}

export default function TitleInput ({ onChange, required = false, value }: Props) {
  return (
    <Container>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder="Loan Title"
        type="text"
      />
    </Container>
  )
}
