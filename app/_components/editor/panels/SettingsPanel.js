'use client'
import { colorPresets } from '@/app/_config/config';
import { centerCanvas } from '@/app/_fabric/fabric-utils';
import { useEditorStore } from '@/app/_store/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Palette } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const SettingsPanel = () => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const {canvas, markAsModified} = useEditorStore();

  const handleColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const handleApplyChanges = () => {
    if(!canvas) return;

    canvas.set('backgroundColor', backgroundColor);
    canvas.renderAll();

    centerCanvas(canvas);
    markAsModified();
  }

  useEffect(() => {
    handleApplyChanges();
  }, [backgroundColor]);

  return (
    <div className='p-4 space-y-6'>
      {/* Title */}
      <div className='flex items-center space-x-2 mb-4'>
        <Palette className='w-5 h-5 text-purple-600' />
        <h3 className='text-lg font-semibold'>Choose Background Color</h3>
      </div>

      {/* Presets */}
      <div className='space-y-2'>
        <div className='grid grid-cols-6 gap-2 mb-3'>
          {colorPresets.map((color) => (
            <TooltipProvider key={color}>
              <Tooltip>
                <TooltipTrigger asChild={true}>
                  <div
                    onClick={() => setBackgroundColor(color)}
                    className={`w-8 h-8 rounded-md cursor-pointer border transition-transform hover:scale-110 ${
                      color === backgroundColor ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {color === backgroundColor && (
                      <Check className='w-4 h-4 text-white mx-auto drop-shadow-md' />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{color}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Custom color picker */}
      <div className="space-y-2">
        <label htmlFor="customColor" className="block text-sm font-medium text-gray-700">
          Or pick a custom color:
        </label>
        <div className="flex items-center space-x-3 rounded-lg">
          <input
            type="color"
            id="customColor"
            value={backgroundColor}
            onChange={handleColorChange}
            className="w-10 h-10 border-none cursor-pointer rounded-md"
          />
          <input 
            type='text'
            value={backgroundColor}
            onChange={handleColorChange}
            className='flex-1 border-1 p-1 rounded-md'
            placeholder={'#ffffff'}
          />
        </div>

        <Separator className={'my-4'} />
        <Button className={'w-full cursor-pointer bg-purple-600 hover:bg-purple-800'} onClick={handleApplyChanges}>
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
