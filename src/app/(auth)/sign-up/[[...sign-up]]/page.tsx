'use client'

import { SignUp } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const SignUpPage = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <SignUp />
}

export default SignUpPage
