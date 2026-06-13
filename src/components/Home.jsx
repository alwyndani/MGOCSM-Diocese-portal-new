import React from 'react'
import HeroBanner from '../Home/HeroBanner'
import MottoStrip from '../Home/MottoStrip'
import About from '../Home/HomeAbout'
import PrayerRequest from '../Home/PrayerRequest'
import Members from '../Home/Members'

export const Home = () => {
  return (
    <div>

         <HeroBanner />
       <MottoStrip />
  <About />
  <Members />
<PrayerRequest />

    </div>
  )
}
