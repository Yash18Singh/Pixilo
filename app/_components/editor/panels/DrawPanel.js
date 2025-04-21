'use client'
import { brushSizes, drawingPanelColorPresets } from '@/app/_config/config';
import { toggleDrawingMode, toggleEraseMode, updateDrawingBrush } from '@/app/_fabric/fabric-utils';
import { useEditorStore } from '@/app/_store/store'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, EraserIcon, Minus, Paintbrush, Palette, PencilIcon, Plus } from 'lucide-react';
import React, { useReducer, useState } from 'react'

const initialState = {
  isDrawingMode: false,
  isErasing: false,
  drawingColor: '#000000',
  brushWidth: 5,
  drawingOpacity: 100,
  activeTab: 'colors',
};

function drawReducer(state, action){
  switch (action.type) {
    case 'TOGGLE_DRAWING':
      return { ...state, isDrawingMode: action.payload };
    case 'TOGGLE_ERASING':
      return { ...state, isErasing: action.payload };
    case 'SET_DRAWING_COLOR':
      return { ...state, drawingColor: action.payload };
    case 'SET_BRUSH_WIDTH':
      return { ...state, brushWidth: action.payload };
    case 'SET_DRAW_OPACITY':
      return { ...state, drawingOpacity: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}

const DrawPanel = () => {
  const {canvas} = useEditorStore();
  const [state, dispatch] = useReducer(drawReducer, initialState);

  const handleDrawingColorChange = (color) => {
    dispatch({ type: 'SET_DRAWING_COLOR', payload: color });
  
    if (canvas && state.isDrawingMode && !state.isErasing) {
      updateDrawingBrush(canvas, { color: color });
    }
  };

  const handleToggleDrawingMode = () => {
    if (!canvas) return;
  
    const nextDrawingMode = !state.isDrawingMode;
  
    dispatch({ type: 'TOGGLE_DRAWING', payload: nextDrawingMode });
  
    if (!nextDrawingMode) {
      dispatch({ type: 'TOGGLE_ERASING', payload: false });
    }
  
    toggleDrawingMode(canvas, nextDrawingMode, state.drawingColor, state.brushWidth);
  }
  

  const handleToggleEraseMode = () => {
    if (!canvas || !state.isDrawingMode) return;
  
    const newEraseState = !state.isErasing;
    dispatch({ type: 'TOGGLE_ERASING', payload: newEraseState });
  
    toggleEraseMode(canvas, newEraseState, state.drawingColor, state.brushWidth * 2);
  };
  

  const handleBrushWidthChange = (width) => {
    dispatch({type:'SET_BRUSH_WIDTH', payload: width});

    if(canvas && state.isDrawingMode){
      updateDrawingBrush(canvas, {width: state.isErasing ? width*2 : width})
    }
  }

  const handleDrawingOpacityChange = (opacity) => {
    dispatch({type:'SET_DRAW_OPACITY', payload: opacity});

    if(canvas && state.isDrawingMode && !state.isErasing){
      updateDrawingBrush(canvas, {opacity: opacity/100})
    }
  }

  return (
    <div className='p-4'>
      <div className='space-y-5'>
        <Button onClick={handleToggleDrawingMode} variant={state.isDrawingMode ? 'default' : 'outline'} className={`w-full cursor-pointer py-6 group transition-all ${state.isDrawingMode ? 'bg-purple-600 hover:bg-purple-800' : 'bg-white hover:bg-gray-100 text-black'}`} size='lg'>
          <PencilIcon className={`mr-2 h-10 w-10 ${state.isDrawingMode ? 'animate-bounce' : 'text-black hover:animate-bounce'}`} />
          <span className={`font-medium text-black ${state.isDrawingMode && 'text-white'}`}> {state.isDrawingMode ? 'Exit Drawing Mode' : 'Enter Drawing Mode'} </span>
        </Button>


        {
          state.isDrawingMode &&
          <Tabs defaultValue='colors' className={'w-full'} value={state.activeTab} onValueChange={(value) => dispatch({type:'SET_ACTIVE_TAB', payload:value})}>
            <TabsList className={'grid grid-cols-3 mb-4 cursor-pointer'}>
              <TabsTrigger value='colors' className={'cursor-pointer'}>
                <Palette className='mr-2 h-4 w-4' />
                Colors
              </TabsTrigger>

              <TabsTrigger value='brush' className={'cursor-pointer'}>
                <Paintbrush className='mr-2 h-4 w-4' />
                Brush
              </TabsTrigger>

              <TabsTrigger value='tools' className={'cursor-pointer'}>
                <EraserIcon className='mr-2 h-4 w-4' />
                Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value='colors'>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <Label>Color Palette</Label>
                  {/* <div className='w-6 h-6 rounded-full border shadow-sm' style={{backgroundColor:state.drawingColor}}></div> */}
                    <input
                      type="text"
                      value={state.drawingColor}
                      onChange={(e) => handleDrawingColorChange(e.target.value)}
                      className='w-[30%] border border-gray-300 rounded-md p-2'
                    />
                  <label className="inline-block relative cursor-pointer">
                    <input
                      type="color"
                      value={state.drawingColor}
                      onChange={(e) => handleDrawingColorChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span
                      className="block w-10 h-10 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: state.drawingColor }}
                    ></span>
                  </label>
                </div>
                <div className='grid grid-cols-5 gap-2'>
                  {
                    drawingPanelColorPresets.map((color) => (
                      <div onClick={() => handleDrawingColorChange(color)} key={color}>
                        <button className={`w-10 h-10 cursor-pointer rounded-full border transition-transform hover:scale-110 ${color === state.drawingColor ? 'ring-1 ring-offset-2 ring-primary' : ''}`} style={{backgroundColor: color}}></button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </TabsContent>



            <TabsContent value='brush' className={'space-y-4'}>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <Label className={'block text-sm font-semibold'}>
                        Brush Size
                    </Label>
                    <span className='font-medium'>{state.brushWidth}</span>
                  </div>
                  
                  <div className='flex items-center space-x-3 cursor-pointer'>
                    <Minus onClick={() => state.brushWidth > 1 && handleBrushWidthChange(state.brushWidth-1)} className='h-6 w-6 text-black border cursor-pointer' />
                    <Slider value={[state.brushWidth]} min={1} max={30} step={1} onValueChange={(e) => handleBrushWidthChange(e[0])} />
                    <Plus onClick={() => state.brushWidth < 30 && handleBrushWidthChange(state.brushWidth+1)} className='h-6 w-6 text-black border' />
                  </div>
                  <div className='grid gridl-cols-4 gap-2'>
                    {
                      brushSizes.map((size) => (
                        <Button onClick={() => handleBrushWidthChange(size.value)} variant={size.value === state.brushWidth ? 'default' : 'outline'} className={`p-3 cursor-pointer ${state.brushWidth === size.value && 'bg-purple-300 text-black hover:bg-purple-400'}`} key={size.value}>
                          {size.label}
                        </Button>
                      ))
                    }
                  </div>

                  <div className='space-y-2 mt-10'>
                    <div className='flex justify-between'>
                      <Label className={'font-medium'}>
                        <Droplets className='mr-2 h-4 w-4' />
                        Opacity
                      </Label>
                      <span className='text-sm font-medium'>{state.drawingOpacity}%</span>
                    </div>
                    <div className='flex items-center space-x-3 cursor-pointer'>
                      <Minus onClick={() => state.drawingOpacity > 1 && handleDrawingOpacityChange(state.drawingOpacity-1)} className='h-6 w-6 text-black border cursor-pointer' />
                      <Slider value={[state.drawingOpacity]} min={1} max={100} step={1} onValueChange={(e) => handleDrawingOpacityChange(e[0])} />
                      <Plus onClick={() => state.drawingOpacity < 100 && handleDrawingOpacityChange(state.drawingOpacity+1)} className='h-6 w-6 text-black border' />
                    </div>
                  </div>
                  
                </div>
            </TabsContent>


            <TabsContent value='tools'>
                <Button onClick={handleToggleEraseMode} variant={state.isErasing ? 'destructive' : 'outline'} className={'w-full py-6 cursor-pointer'} size='lg'>
                  <EraserIcon className='mr-2 w-5 h-5' />
                  {
                    state.isErasing ? 'Stop Eraser' : 'Eraser Mode'
                  }
                </Button>
            </TabsContent>
          </Tabs>
        }
      </div>
    </div>
  )
}

export default DrawPanel
