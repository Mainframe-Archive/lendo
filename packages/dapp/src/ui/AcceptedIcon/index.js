// @flow
import React from 'react'
import styled from 'styled-components'

const Icon = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    color: #00A7E7;
    font-size: 26px;
  }
  
  .icon-text {
    margin-left: 20px;
  }
`

export default function AcceptedIcon() {
  return (
    <Icon>
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em">
        <g fill="none" fillRule="evenodd" stroke="currentColor">
          <g transform="translate(1 1)">
            <circle cx="12" cy="12" r="12" />
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12" />
          </g>
          <path strokeLinecap="round" d="M8 12.924L11.675 17 18 9" />
        </g>
      </svg>

      <p className="icon-text">Signed</p>
    </Icon>
  )
}
