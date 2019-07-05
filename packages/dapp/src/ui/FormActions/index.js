import styled from 'styled-components'

export default styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  margin: 20px auto;
  max-width: 200px;

  > * {
    display: block;
  }

  button {
    width: 100%;
  }
`
