// @flow
import React, { type Node } from 'react'
import classnames from 'classnames'
import Button from 'ui/Button'
import { Link } from 'react-router-dom'

type Props = {
  children: Node,
  to: string,
  className?: string,
  primary?: boolean
}

export default function LinkButton ({ className, children, to, primary, ...props }: Props) {
  return (
    <Link to={to} className={classnames(className)} {...props}>
      <Button primary={primary}>{children}</Button>
    </Link>
  )
}

