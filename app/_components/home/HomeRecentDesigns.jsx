"use client"
import { getUserDesigns } from '@/app/_services/design-service';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import HomeDesignPreview from './HomeDesignPreview';
import { useEditorStore } from '@/app/_store/store';

const HomeRecentDesigns = () => {
    const {designsCount, setDesignsCount, userSubscription} = useEditorStore();
    const [userDesigns, setUserDesigns] = useState([]);
    const router = useRouter();

    const fetchUserDesigns = async() => {
      const result = await getUserDesigns();
      
      if(result){
        setUserDesigns(result?.data);
      }
    }

    useEffect(() => {
      fetchUserDesigns();
    }, []);

    useEffect(() => {
      setDesignsCount(userDesigns.length);
    }, [userDesigns]);

    console.log("TOTAL DESIGNS :", designsCount);

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>
        Recent Designs
      </h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {
            !userDesigns.length ?
            <h1 className='text-2xl font-bold'>No Design Found!</h1>
            :
            userDesigns.map((design) => (
              <div onClick={() => router.push(`/editor/${design._id}`)} key={design._id} className='group cursor-pointer'>
                  {/* <div className='aspect-video bg-gray-100 rounded-lg mb-2 overflow-hidden transition-shadow'>
                      <img src={design.thumbnail} />
                  </div> */}
                  <div className='w-[300px] h-[300px] rounded-lg mb-2 overflow-hidden transition-shadow group-hover:shadow-md'>
                    {
                      design?.canvasData && <HomeDesignPreview key={design._id} design={design} />
                    }
                  </div>
                  <p className='font-bold text-sm truncate'>{design.name}</p>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default HomeRecentDesigns
