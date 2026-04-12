import React from 'react'
import Hero from '../components/layout/Hero';
import LatestNews from '../components/layout/LatestNews';

const Home = () => {
    return (
        <div>
            <Hero />
            <div className='bg-gray-200'>
                <LatestNews />
            </div>
        </div>
    )
}

export default Home
