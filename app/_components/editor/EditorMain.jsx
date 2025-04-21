import React, { useCallback, useEffect, useState } from 'react'
import EditorHeader from './EditorHeader'
import EditorSidebar from './EditorSidebar'
import EditorCanvas from './EditorCanvas'
import { useParams, useRouter } from 'next/navigation'
import { useEditorStore } from '@/app/_store/store'
import { getUserDesignByID } from '@/app/_services/design-service'
import EditorProperties from './EditorProperties'


const EditorMain = () => {
    const params = useParams();
    const router = useRouter();
    const designId = params?.slug;

    const [isLoading, setIsLoading] = useState(designId);
    const [loadAttempt, setLoadAttempt] = useState(false);
    const [error, setError] = useState(null);

    const {canvas, setDesignId, resetStore, setName, showProperties, setShowProperties, isEditing} = useEditorStore();

    useEffect(() => {
        //RESET THE STORE
        resetStore();

        //SET THE DESIGN ID
        if(designId){
            setDesignId(designId);
        }

        return () => {
            resetStore();
        }
    }, []);

    useEffect(() => {
        setLoadAttempt(false);
        setError(null);
    }, [designId]);

    useEffect(() => {
        if(isLoading && !canvas && designId){
            const timer = setTimeout(() => {
                if(isLoading){
                    console.log('CANVAS INIT TIMEOUT');
                    setIsLoading(false);
                }
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, canvas, designId]);

    
    useEffect(() => {
       if(!canvas) return;

       const handleSelectionCreated = () => {
         const activeObject = canvas.getActiveObject();

         if(activeObject){
            setShowProperties(true);
         }
       }

       const handleSelectionCleared = () => {
            setShowProperties(false);
       }

       canvas.on('selection:created', handleSelectionCreated);
       canvas.on('selection:updated', handleSelectionCreated);
       canvas.on('selection:cleared', handleSelectionCleared);

       return () => {
        canvas.off('selection:created', handleSelectionCreated);
        canvas.off('selection:updated', handleSelectionCreated);
        canvas.off('selection:cleared', handleSelectionCleared);
       }
    }, [canvas]);
    


    //load the design
    const loadDesign = useCallback(async() => {
        if(!canvas || !designId || loadAttempt){
            return;
        }

        try {
            setIsLoading(true);
            setLoadAttempt(true);

            const response = await getUserDesignByID(designId);
            const design = response.data;

            if(design){
                //update name
                setName(design.name);
                
                //set the design ID just incase 
                setDesignId(designId);

                try {
                    if(design.canvasData){
                        // canvas.clear();
                        if(design.width && design.height){
                            canvas.setDimensions({
                                width: design.width,
                                height: design.height,
                            });
                        }

                        const canvasData = typeof design.canvasData === 'string'
                        ? JSON.parse(design.canvasData)
                        : design.canvasData;

                        
                        if (design.width && design.height) {
                            canvas.setDimensions({
                                width: design.width,
                                height: design.height,
                            });
                        }
                        
                        canvas.backgroundColor = canvasData.background || 'white';
                        
                        canvas.loadFromJSON(canvasData, () => {
                            canvas.requestRenderAll();
                        }, function(error) {
                            console.error('Error loading canvas from JSON:', error);
                            setError('Error loading canvas from JSON');
                        });

                    } else{
                        console.log('NO CANVAS DATA');
                        canvas.clear();
                        canvas.setWidth(design.width);
                        canvas.setHeight(design.height);
                        canvas.backgroundColor="white";
                        canvas.renderAll();
                    }
                } catch (error) {
                    console.log('ERROR LOADING CANVAS DATA');
                    setError('ERROR LOADING CANVAS DATA')
                } finally{
                    setIsLoading(false);
                }
            }

            console.log('DESIGN DETAILS:', response);
        } catch (error) {
            console.log("FAILED TO LOAD DESIGN :", error);
            setError('FAILED TO LOAD DESIGN');
            setIsLoading(false);
        }
    }, [canvas, designId, loadAttempt, setDesignId]);


    useEffect(() => {
        if(designId && canvas && !loadAttempt){
            loadDesign();
        } else if(!designId){
            router.push('/');
        }
    }, [canvas, designId, loadDesign, loadAttempt]);


  return (
    <div className='flex flex-col h-screen overflow-hidden'>
        <EditorHeader />
        <div className='flex flex-1 overflow-hidden'>
            {
                isEditing && <EditorSidebar />
            }
            <div className='flex-1 flex flex-col overflow-hidden relative'>
                <main className='flex-1 overflow-hidden bg-[#f0f0f0] flex items-center justify-center'>
                    <EditorCanvas />
                </main> 
            </div>
        </div>
        {
            showProperties && isEditing &&
            <EditorProperties />
        }
    </div>
  )
}

export default EditorMain
