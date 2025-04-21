'use client'
import { addImageToCanvas } from '@/app/_fabric/fabric-utils';
import { fetchWithAuth } from '@/app/_services/base-service';
import { uploadFileWithAuth } from '@/app/_services/upload-service';
import { useEditorStore } from '@/app/_store/store'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'

const UploadPanel = () => {
  const {canvas} = useEditorStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userUploads, setUserUploads] = useState([]);

  const {data: session, status} = useSession();

  const fetchUserUploads = useCallback(async() => {
    if(status !== 'authenticated' || !session.idToken){
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/v1/media/get');
      console.log('UPLOADS :', data);
      setUserUploads(data?.data || []);
    } catch (error) {
      console.log('ERROR GETTING UPLOADS', error);

    } finally {
      setIsLoading(false);
    }

  }, [status, session?.idToken]);


  useEffect(() => {
    if(status === 'authenticated'){
      fetchUserUploads();
    }
  }, [status]);


  const handleFileUpload = async(e) => {
    console.log('UPLOADED FILE: ', e.target.files);
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const result = await uploadFileWithAuth(file);
      setUserUploads((prev) => [result?.data, ...prev]);

    } catch (error) {
      console.log('Error while uploading the file');

    } finally {
      setIsUploading(false);
    }
  }

  const handleAddImage = (imageUrl) => {
    if(!canvas) return;
    addImageToCanvas(canvas, imageUrl);
  }


  return (
    <div className='h-full overflow-y-auto'>
      <div className='p-4 space-y-4'>
        <div className='flex gap-2'>
          <Label className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-800 text-white rounded-md cursor-pointer h-12 font-medium transition-all ${isUploading ? 'opacity-40' : 'opacity-100'}`}> 
            <Upload className='w-5 h-5 animate-bounce' />
            <span>{isUploading ? 'Uploading...' : 'Upload Images...'}</span>
            <Input
              type='file'
              className={'hidden'}
              accept='image/*'
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </Label>
        </div>

        <div className='mt-5'>
          <h4 className='text-md text-gray-500'>Your Uploads</h4>
          {
            isLoading ? 
            <div className='border p-6 flex rounded-md items-center justify-center'>
                <Loader className='w-4 h-4' />
                <p className='font-bold text-sm'>Please wait...</p>
            </div>
            :
            userUploads.length > 0 ? 
            <div className='grid grid-cols-2 gap-2 mt-5 justify-center items-center'>
              {
                userUploads.map((imageData) => (
                  <div onClick={() => handleAddImage(imageData.url)} className='aspect-auto border border-gray-200 bg-gray-50 rounded-md overflow-hidden hover:opacity-85 transition-opacity relative group' key={imageData._id}>
                    <img src={imageData.url} alt={imageData.name} className='w-full h-full object-cover cursor-pointer' />
                  </div>
                ))
              }
            </div>
            :
            <div>No Uploads!</div>
          }
        </div>
      </div>
    </div>
  )
}

export default UploadPanel
