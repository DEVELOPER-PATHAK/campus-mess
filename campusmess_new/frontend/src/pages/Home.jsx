import React from 'react'
import { Navbar } from '../Navbar'
import { HeroSection } from '../HeroSection'
import { Functionalities } from '../Functionalities'
import { AboutUs } from '../AboutUs'
import { Footer } from '../Footer'

 const Home = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <Functionalities/>
        <AboutUs/>
        <Footer/>

    </div>
  )
}

export default Home