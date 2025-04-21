"use client"
import { initializeFabric } from '@/app/_fabric/fabric-utils';
import { useEditorStore } from '@/app/_store/store';
import React, { useEffect, useRef } from 'react'

const EditorCanvas = () => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const initAttemptedRef = useRef(false);

  const {setCanvas, markAsModified} = useEditorStore();

  useEffect(() => {
    const cleanCanvas = () => {
      if(fabricCanvasRef.current){
        try {
          fabricCanvasRef.off('object:added', handleCanvasChange);
          fabricCanvasRef.off('object:modified', handleCanvasChange);
          fabricCanvasRef.off('object:removed', handleCanvasChange);
          fabricCanvasRef.off('path:created', handleCanvasChange);

        } catch (error) {
          console.log('ERROR REMOVING EVENT LISTENERS', error);
        }

        try {
          fabricCanvasRef.current.dispose();
        } catch (error) {
          console.log("ERROR DISPOSING CANVAS", error);
        }
      }

      fabricCanvasRef.current = null;
      setCanvas(null);
    }

    cleanCanvas();

    //reset init flag
    initAttemptedRef.current = false;

    //init our canvas
    const initCanvas = async() => {
      if(typeof window === undefined || !canvasRef.current || initAttemptedRef.current){
        return;
      }

      initAttemptedRef.current = true;

      try {
        const fabricCanvas = await initializeFabric(canvasRef.current, canvasContainerRef.current);
        if(!fabricCanvas){
          console.log('FAILED TO INITIALIZE FABRIC CANVAS');
          return;
        }

        fabricCanvasRef.current = fabricCanvas;

        //set the canvas in store
        setCanvas(fabricCanvas);

        console.log("CANVAS IS INITIALIZED AND STORED")

        //apply custom style for the controls

        //set up event listeners
        const handleCanvasChange = () => {
            //implement the auto save feature and save updated canvas data
            markAsModified();
            console.log('CANVAS OBJECT CHANGED');
        }

        fabricCanvas.on('object:added', handleCanvasChange);
        fabricCanvas.on('object:modified', handleCanvasChange);
        fabricCanvas.on('object:removed', handleCanvasChange);
        fabricCanvas.on('path:created', handleCanvasChange);

      } catch (error) {
        console.log('FAILED TO INITIALIZE FABRIC CANVAS');
      }
    }

    const timer = setTimeout(() => {
      initCanvas();
    }, 50);

    return () => {
      clearTimeout(timer);
      cleanCanvas();
    }
  }, []);

  return (
    <div className='relative w-full h-[600px] overflow-auto' ref={canvasContainerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default EditorCanvas
