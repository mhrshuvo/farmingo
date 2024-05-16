import React from 'react'
import logo from '@/public/assets/logo.png'
import Image from 'next/image'

const Logo = () => {
  return (
    <div>
      <Image src={logo} height={100} width={100}></Image>
    </div>
  )
}

export default Logo
