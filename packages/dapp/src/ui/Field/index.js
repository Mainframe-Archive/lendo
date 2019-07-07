// @flow
import React from 'react'
import styled from 'styled-components'
import { addDays } from 'date-fns'
import classnames from 'classnames'
import { DropDown } from '@morpheus-ui/core'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import formatNumber from 'util/formatNumber'
import { primary } from 'theme'

const tomorrow = () => addDays(new Date(), 1)
const BACKSPACE_CODE = 8

const FieldContainer = styled.div`
  display: flex;
  align-items: baseline;

  .input-container {
    color: ${primary};
    flex-grow: 1;
    margin-bottom: 24px;
  }
  
  .native-input {
    border: 1px solid ${primary};
    border-radius: 5px;
    color: ${primary};
    font-size: 1.3rem;
    padding: 10px 13px;
    transition: all 500ms ease-in;
    width: 100%;
    
    &:focus, &:active {
      outline: none;
      background-color: floralwhite;
    }
  }

  .date input {
    border: none;
    border-bottom: 1px solid currentColor;
    border-radius: 0;
    height: 2.4rem;
    padding: 0;
    text-align: center;
  }
`

const Label = styled.label`
  max-width: 165px;
  width: 100%;
`

type Props = {
  type: string,
  label?: string,
  placeholder?: string,
  value: any,
  options?: any,
  onChange?: any => void,
  onClick?: () => void,
  onBlur?: () => void,
  onKeyPress?: () => void,
  required?: boolean,
}

export default function Field(props: Props) {
  const {
    label,
    placeholder,
    options = [],
    onClick,
    type = 'text',
    value,
    required = false,
  } = props

  return (
    <FieldContainer>
      {label && <Label>{label}</Label>}
      <div className={classnames('input-container', type)}>
        {type === 'date' ? (
          <ReactDatePicker
            selected={value}
            onChange={createChangeListener(props)}
            dateFormat="d MMMM yyyy"
            minDate={tomorrow()}
            required={required}
            placeholderText={placeholder}
          />
        ) : type === 'select' ? (
          <DropDown
            displayKey="name"
            valueKey="id"
            defaultValue={value}
            options={options}
            required={required}
            onChange={createChangeListener(props)}
            label={placeholder || 'Please Select'}
          />
        ) : (
          <input
            className="native-input"
            type={type === 'number' ? 'text' : type}
            value={value}
            onChange={createChangeListener(props)}
            onBlur={createBlurListener(props)}
            onClick={onClick}
            onKeyPress={createKeyPressListener(props)}
            placeholder={placeholder}
            required={required}
          />
        )}
      </div>
    </FieldContainer>
  )
}

function createChangeListener(props) {
  if (typeof props.onChange !== 'function') return () => {}

  if (props.type === 'number') {
    return (event) => {
      const formatted = formatNumber(event.target.value)
      props.onChange && props.onChange(formatted)
    }
  }

  return props.onChange
}

function createBlurListener(props) {
  if (typeof props.onBlur !== 'function') return () => {}

  if (props.type === 'number') {
    return () => {
      if (props.value === '0.00') props.onChange && props.onChange('')
    }
  }

  return props.onBlur
}

function createKeyPressListener(props) {
  if (props.type === 'number') {
    return (event) => {
      if (event.keyCode === BACKSPACE_CODE && props.value === '0.00') {
        props.onChange && props.onChange('')
      }
    }
  }

  return props.onKeyPress
}
