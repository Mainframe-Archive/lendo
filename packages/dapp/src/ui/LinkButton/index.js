// @flow
import React, { type Node } from 'react'
import classnames from 'classnames'
import Button from 'ui/Button'
import { Link } from 'react-router-dom'

type Props = {
  children: Node,
  to: string,
  className?: string
}

export default function ButtonLink({className, children, to}: Props) {
  return (
    <Link to={to} className={classnames(className)}>
      <Button primary>{children}</Button>
    </Link>
  )
}

