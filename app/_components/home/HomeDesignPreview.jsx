'use client'
import React, { useEffect, useRef, useState } from 'react'

const HomeDesignPreview = ({design}) => {
    const [canvasId] = useState(`canvas-${design._id}-${Date.now()}`);
    const fabricCanvasRef = useRef(null);

    useEffect(() => {
        if(!design.canvasData) return;

        const timer = setTimeout(async() => {
            try {
                if(fabricCanvasRef.current && typeof fabricCanvasRef.current.dispose === 'function'){
                    try {
                        fabricCanvasRef.current.dispose();
                        fabricCanvasRef.current = null;
                    } catch (error) {
                        console.log("ERROR WHILE DISPOSING CANVAS")
                    }
                }

                const fabric = await import('fabric');
                const canvasElement = document.getElementById(canvasId);

                if(!canvasElement) return;

                const designPreviewCanvas = new fabric.StaticCanvas(canvasId, {
                    width: 300,
                    height:300,
                    renderOnAddRemove: true,
                })

                fabricCanvasRef.current = designPreviewCanvas

                let canvasData;

                try {
                    canvasData = typeof design.canvasData === 'string' ?
                    JSON.parse(design.canvasData) : design.canvasData;

                } catch (error) {
                    console.log('ERROR PARSING CANVAS DATA', error);
                    return;
                }

                if(canvasData.background){
                    designPreviewCanvas.backgroundColor = canvasData.background;
                    designPreviewCanvas.requestRenderAll();
                }

                designPreviewCanvas.loadFromJSON(canvasData, () => {
                    designPreviewCanvas.requestRenderAll();
                });

            } catch (error) {
                console.log("ERROR RENDERING PREVIEW", error);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if(fabricCanvasRef.current && typeof fabricCanvasRef.current.dispose === 'function'){
                try {
                    fabricCanvasRef.current.dispose();
                    fabricCanvasRef.current = null;
                } catch (error) {
                    console.log("ERROR WHILE DISPOSING CANVAS")
                }
            }
        }
    }, [design?._id, canvasId]);

  return (
    <div>
      <canvas ref={fabricCanvasRef} id={canvasId} width="300" height="300" className='h-full w-full object-cover' />
    </div>
  )
}

export default HomeDesignPreview
