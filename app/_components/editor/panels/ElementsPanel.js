'use client'
import { addShapeToCanvas } from '@/app/_fabric/fabric-utils';
import { shapeDef, shapeTypes } from '@/app/_fabric/shapes/ShapeDef';
import { useEditorStore } from '@/app/_store/store'
import React, { useEffect, useRef, useState } from 'react'

const ElementsPanel = ({shapeColor}) => {
  const {canvas} = useEditorStore();
  const miniCanvasRef = useRef({});
  const canvasElementRef = useRef({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    setSelectedColor(shapeColor);
  }, [shapeColor]);

  useEffect(() => {
    if(isInitialized) return;

    const timer = setTimeout(async() => {
      try {
        const fabric = await import('fabric');

        for(const shapeType of shapeTypes){
          const canvasElement = canvasElementRef.current[shapeType];
          if(!canvasElement) continue;

          const canvasId = `mini-canvas-${shapeType}-${Date.now()}`;
          canvasElement.id = canvasId;

          try {
            const definition = shapeDef[shapeType];

            const miniCanvas = new fabric.StaticCanvas(canvasId, {
              width: 100,
              height: 100,
              backgroundColor: 'transparent',
              renderOnAddRemove: true,
            });

            miniCanvasRef.current[shapeType] = miniCanvas;
            definition.thumbnail(fabric, miniCanvas);
            miniCanvas.renderAll();

          } catch (defError) {
            console.log('Error while creating definition :', defError);
          }
        }
      } catch (error) {
        console.log('FAILED TO INIT :', error);
      }
    }, 100);

    return ()=> clearTimeout(timer);
  }, [isInitialized]);


  useEffect(() => {
    return () => {
      Object.values(miniCanvasRef.current).forEach(miniCanvas => {
        if(miniCanvas && typeof miniCanvas.dispose === 'function'){
          try {
            miniCanvas.dispose();
          } catch (error) {
            console.log('ERROR DISPOSING CANVAS :', error);
          }
        }
      })

      miniCanvasRef.current = {};
      setIsInitialized(false);
    }
  }, []);

  const setCanvasRef = (getCurrentElement, shapeType) => {
    if(getCurrentElement){
      canvasElementRef.current[shapeType] = getCurrentElement;
    }
  }

  const handleShapeClick = (type, bgColor) => {
    if(type === 'line'){
      addShapeToCanvas(canvas, type, {stroke: bgColor ? bgColor : '#000000'});
    } else{
      addShapeToCanvas(canvas, type, {fill: bgColor ? bgColor : '#000000'});
    }
    
  } 

  return (
    <div className='h-full overflow-y-auto'>
      <div className='flex-1 p-4'>
        <div className='grid grid-cols-2 gap-3 items-center justify-center'>
          {
            shapeTypes.map((shape) => (
              <div onClick={() => handleShapeClick(shape, selectedColor)} style={{height:'100px'}} className='cursor-pointer flex flex-col item-center justify-center' key={shape}>
                <canvas width='120' height='120' ref={(el) => setCanvasRef(el, shape)} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ElementsPanel
