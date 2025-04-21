import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import React, { useEffect } from 'react'

const HomeAiFeatures = () => {
  return (
    <div className='cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 mt-12'>
        <h2 className='text-lg font-semibold mb-3 flex items-center justify-center'>
            <Sparkles className='h-5 w-5 text-purple-500 mr-2' />
            AI Image Creation
        </h2>
        <p className='text-gray-700 mb-4 text-center'>Create stunning thumbnails images for your content with AI</p>
        <div className='flex flex-wrap gap-3 justify-center'>
            <Button variant='outline' className={'cursor-pointer rounded-full px-5 py-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 border-purple-200 shadow-sm flex items-center'}>
                Generate thumbnails from video title
            </Button>
        </div>
    </div>
  )
}

export default HomeAiFeatures
