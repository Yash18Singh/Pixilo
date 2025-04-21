'use client'
import { textPresets } from '@/app/_config/config';
import { addTextToCanvas } from '@/app/_fabric/fabric-utils';
import { useEditorStore } from '@/app/_store/store'
import { Button } from '@/components/ui/button';
import { Type } from 'lucide-react';
import React, { useState } from 'react'

const TextPanel = () => {
  const {canvas} = useEditorStore();
  const [textColor, setTextColor] = useState('#000000');

  const handleAddCustomTextBox = () => {
    if(!canvas) return;

    addTextToCanvas(canvas, 'Enter text here...', {fontSize:24, fill:textColor});
  }

  const handleAddPresetText = (preset) => {
    if(!canvas) return;

    addTextToCanvas(canvas, preset.text, {fill:textColor});
  }

  return (
    <div className='h-full overflow-y-auto'>
      <div className='p-4 space-y-4'>
        <Button onClick={handleAddCustomTextBox} className={'w-full py-3 px-4 bg-purple-600 hover:bg-purple-800 text-white rounded-md flex items-center justify-center transition-all cursor-pointer'}>
          <Type className='mr-2 h-5 w-5' />
          <span className='font-medium'>Add a text box</span>
        </Button>

        <div className='pt-2'>
          <h4 className='text-lg font-medium text-gray-800 mb-2'>Default Text Styles</h4>
          <div className='space-y-2 flex flex-col'>
            {
              textPresets.map((preset, index) => (
                <button onClick={() => handleAddPresetText(preset)} className='w-full text-left p-3 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:scale-102 transition-colors cursor-pointer' style={{fontSize:`${preset.fontSize}px`, fontWeight: preset.fontWeight, fontStyle: preset.fontStyle || 'normal', fontFamily:preset.fontFamily}} key={index}>
                  {preset.text}
                </button>
              ))
            }
          </div>
        </div>

        {/* <div className='mt-10 flex justify-between items-center'>
          <h1 className='text-md font-semibold'>Text Color</h1>
          <label className="inline-block relative cursor-pointer">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span
              className="block w-10 h-10 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: textColor }}
            ></span>
          </label>
        </div> */}
      </div>
    </div>
  )
}

export default TextPanel
