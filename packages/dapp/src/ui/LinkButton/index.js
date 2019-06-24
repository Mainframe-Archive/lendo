// @flow
import React, { type Node } from 'react'
import Button from 'ui/Button'
import { Link } from 'react-router-dom'

type Props = {
  children: Node,
  to: string
}

export default function ButtonLink({children, to}: Props) {
  return (
    <Link to={to}>
      <Button primary>{children}</Button>
    </Link>
  )
}

