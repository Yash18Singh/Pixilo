"use client"
import React, { useEffect } from 'react'
import HomeSidebar from './_components/home/HomeSidebar'
import HomeBanner from './_components/home/HomeBanner'
import HomeHeader from './_components/home/HomeHeader'
import HomeDesignTypes from './_components/home/HomeDesignTypes'
import HomeAiFeatures from './_components/home/HomeAiFeatures'
import HomeRecentDesigns from './_components/home/HomeRecentDesigns'
import { getUserSubscription } from './_services/subscription-service'
import { useEditorStore } from './_store/store'

const MainPage = () => {
  const {userSubscription, setUserSubscription} = useEditorStore();

  const fetchUserSubscription = async() => {
    const response = await getUserSubscription();
    console.log("SUBSCRIPTION :", response);

    setUserSubscription(response.data.isPremium);
  }

  useEffect(() => {
    fetchUserSubscription();
  }, []);

  console.log('USER SUBSCRIPTION :', userSubscription);

  return (
    <div className='flex min-h-screen bg-white'>
      <HomeSidebar />
      <div className='flex-1 flex flex-col ml-[72px]'>
        <HomeHeader />
        <main className='flex-1 p-6 overflow-y-auto pt-20'>
            <HomeBanner />
            <HomeDesignTypes />
            <HomeAiFeatures />
            <HomeRecentDesigns />
        </main>
      </div>
    </div>
  )
}

export default MainPage
