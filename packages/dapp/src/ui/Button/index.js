// @flow
import styled from 'styled-components'
import { primary, secondary, gray } from 'theme'

export default styled.button`
  border: none;
  border-radius: 3px;
  background-color: ${props => props.primary ? primary : secondary};
  color: ${props => props.primary ? "white" : primary};
  font-size: 1rem;
  font-weight: bold;
  padding: 12px;
  min-width: 96px;
  text-transform: uppercase;
  transition: all 200ms;
  
  &:hover:not(:disabled) {
    cursor: pointer;
    filter: brightness(.9);
  }
  
  &:active {
    transform: translate(1px, 1px);
  }
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    background-color: ${gray};
  }
`
