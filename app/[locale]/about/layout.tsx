import { Metadata } from 'next'
import React, { FC } from 'react'

export const metadata: Metadata = {
  title: "About "
}

const layout:FC<{children: React.ReactElement}> = ({children}) => {
  return (
    <>{children}</>
  )
}

export default layout