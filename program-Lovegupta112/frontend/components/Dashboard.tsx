"use client";
import { useState } from 'react'
import HeroSection from './HeroSection'
import Blog from './Blog/Blog'
import { Text } from './retroui/Text'
import CreateBlogDialog from './Blog/CreateBlogDialog'

const Dashboard = () => {
    const [blogAddedCount, setBlogAddedCount] = useState<number>(0);

    return (
        <div className='flex flex-col p-4'>
            <HeroSection/>
            <div className='flex py-4 pt-5 gap-3'>
                <div className='grow-1 flex flex-col gap-5'>
                    <div className='flex justify-between p-2'>
                        <Text as="h2">Blogs</Text>
                        <CreateBlogDialog setBlogAddedCount={setBlogAddedCount} />
                    </div>
                    <div className='w-full'>
                        <Blog blogAddedCount={blogAddedCount} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard