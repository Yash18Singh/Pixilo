import { saveDesign } from '@/app/_services/design-service';
import { useEditorStore } from '@/app/_store/store';
import { Button } from '@/components/ui/button'
import { Crown, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from "sonner"
import { designTypes } from '@/app/_config/config';

const HomeDesignTypes = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {designsCount, userSubscription} = useEditorStore();

    const handleCreateNewDesign = async(height, width, category) => {
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
            width: width,
            height: height,
            category: category,
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
    <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mt-12 justify-center'>
        {
            designTypes.map((type, index) => (
                <div onClick={() => handleCreateNewDesign(type.height, type.width, type.label)} key={index} className='flex flex-col items-center cursor-pointer hover:scale-105 hover:bg-gray-100 p-5 rounded-xl transition-transform duration-200'>
                    <div className={`${type.bgColor} w-14 h-14 rounded-full flex items-center justify-center mb-2`}>
                        {type.icon}
                    </div>
                    <span className='text-xs font-medium text-center'>{type.label}</span>
                </div>
            ))
        }
    </div>
  )
}

export default HomeDesignTypes
