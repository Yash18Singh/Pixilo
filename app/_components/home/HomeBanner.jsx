import { saveDesign } from '@/app/_services/design-service';
import { useEditorStore } from '@/app/_store/store';
import { Button } from '@/components/ui/button'
import { Crown, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from "sonner"

const HomeBanner = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {designsCount, userSubscription} = useEditorStore();

  const handleCreateNewDesign = async() => {
    if(designsCount >= 5 && !userSubscription){
      toast.error("PLEASE UPGRADE TO PREMIUM!!", {
        description: "Free users can only create 5 designs",
        
      });
      return;
    }

    if(loading) return;

    try {
      setLoading(true);

      const initialDesignData = {
        name: 'Untitled Design',
        canvasData: null,
        width: 825,
        height: 465,
        category: 'youtube_thumbnail'
      };

      const newDesign = await saveDesign(initialDesignData);

      if(newDesign?.success){
        router.push(`/editor/${newDesign?.data?._id}`);
        setLoading(false);
      } else{
        throw new Error('Failed to create new design');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className='rounded-xl overflow-hidden bg-gradient-to-r from-[#00c4cc] via-[#8b3dff] to-[#5533ff] text-white p-4 sm:p-6 md:p-8 text-center'>
        <div className='flex flex-col sm:flex-row justify-center items-center mb-2 sm:mb-4'>
            <Crown className='h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-yellow-300' />
            <span className='sm:ml-2 text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-extrabold leading-tight'>
                Create Innovative Designs
            </span>
        </div>

        <h2 className='text-sm sm:text-base md:text-lg font-semibold sm:mb-6 max-w-2xl mx-auto'>Design eye-catching thumbnails, banners, cards and much more</h2>
    
        <Button onClick={() => handleCreateNewDesign()} className={'text-[#8b3dff] cursor-pointer bg-white hover:bg-gray-100 rounded-lg px-4 py-4 sm:px-6 sm:py-4'}>
          {
            loading ? 
            <Loader className='w-4 h-4' />
            :
            <p>Start Designing</p>
          }
        </Button>
    </div>
  )
}

export default HomeBanner
