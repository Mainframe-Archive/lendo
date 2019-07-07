// @flow
import React, { type Node } from 'react'
import classnames from 'classnames'
import Button from 'ui/Button'
import { Link } from 'react-router-dom'

type Props = {
  children: Node,
  to: any,
  className?: string,
  primary?: boolean,
  disabled?: boolean,
}

export default function LinkButton({
  className,
  children,
  to,
  primary,
  disabled = false,
  ...props
}: Props) {
  return (
    <Link to={to} className={classnames(className)} {...props}>
      <Button primary={primary} disabled={disabled}>
        {children}
      </Button>
    </Link>
  )
}
