// @flow
import styled from 'styled-components'
import { primary } from 'theme'

export default styled.table`
  border-spacing: 0;
  width: 100%;

  thead {
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  tbody {
    font-size: 1.3rem;
  }

  th {
    border: 1px solid ${primary};
    border-left: none;
    border-right: none;
    text-align: left;
    padding: 10px 0;

    &:first-child {
      border-left: 1px solid ${primary};
      padding-left: 10px;
    }

    &:last-child {
      border-right: 1px solid ${primary};
      padding-right: 10px;
    }
  }

  tr {
    border: 1px solid ${primary};

    &:not(:last-of-type) {
      border-bottom: none;
    }
  }

  td {
    border-bottom: 1px solid ${primary};
    padding: 10px 0;

    &:first-child {
      border-left: 1px solid ${primary};
      padding-left: 10px;
    }

    &:last-child {
      border-right: 1px solid ${primary};
      padding-right: 10px;
    }
  }
`
