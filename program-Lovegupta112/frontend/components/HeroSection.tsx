import React from 'react'
import { Text } from './retroui/Text'

const HeroSection = () => {
  return (
    <div className='border border-grey-200  text-center flex flex-col items-center justify-center bg-[#ffdb33] gap-6 h-50 '>
        <Text as="h2" className='text-wrap uppercase'>Where thoughts turn into words </Text>
        <Text as="h3" className='text-wrap uppercase'>And words into impact</Text>
    </div>
  )
}

export default HeroSection