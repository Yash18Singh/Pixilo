'use client'
import { fontFamilies } from '@/app/_config/config';
import { bringToFront, cloneSelectedObject, deleteSelectedObject, flipSelectedHorizontal, flipSelectedVertical, sendToBack } from '@/app/_fabric/fabric-utils';
import { useEditorStore } from '@/app/_store/store'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Copy, FlipHorizontal, FlipVertical, Italic, MoveDown, MoveUp, Trash, Underline } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const EditorProperties = () => {
  const {canvas, markAsModified} = useEditorStore();
  
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectType, setObjectType] = useState('');

  //common
  const [opacity, setOpacity] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  //text
  const [textProperties, setTextProperties] = useState({
    text: '',
    fontSize:24,
    fontFamily: 'Arial',
    fontBold: false,
    fontItalic: false,
    underline: false,
    fill: '#000000',
    backgroundColor: '',
    letterSpacing: 0,
  });

  const handleTextProperties = (property, value) => {
    if(property === 'fontSize'){
      if(value <= 1){
        value = 1;
      } 
      else if(value > 200){
        value = 200
      }
    }

    if(property==='fontBold'){
      if(value == true){
        updateObjectProperty('fontWeight', 800);
      } else{
        updateObjectProperty('fontWeight', 400);
      }
    }

    if(property==='fontItalic'){
      if(value == true){
        updateObjectProperty('fontStyle', 'italic');
      } else{
        updateObjectProperty('fontStyle', 'normal');
      }
    }

    if(property==='underline'){
      if(value == true){
        updateObjectProperty('textDecoration', 'underline');
      } else{
        updateObjectProperty('textDecoration', 'none');
      }
    }

    setTextProperties(prev => ({
      ...prev,
      [property]: value
    }));

    updateObjectProperty(property,value);
  }

  useEffect(() => {
    if (!selectedObject) return;
  
    setTextProperties({
      text: selectedObject.text || '',
      fontSize: selectedObject.fontSize || 24,
      fontFamily: selectedObject.fontFamily || 'Arial',
      fontBold: selectedObject.fontBold || false,
      fontItalic: selectedObject.fontItalic || false,
      underline: selectedObject.underline || false,
      fill: selectedObject.fill || '#000000',
      backgroundColor: selectedObject.backgroundColor || '',
      letterSpacing: selectedObject.charSpacing || 0,
    });
  }, [selectedObject]);



  //shapes
  const [shapeProperties, setShapeProperties] = useState({
    fill: '#000000',
    stroke: '#ffffff',
    strokeWidth: 0,
    borderStyle: 'solid',
  });

  const handleShapeProperties = (property, value) => {
    setShapeProperties((prev) => ({
      ...prev,
      [property] : value,
    }));

    updateObjectProperty(property, value);
  }

  useEffect(() => {
    if (!selectedObject) return;

    setShapeProperties({
      fill: selectedObject.fill || '#000000',
      stroke: selectedObject.stroke || '#ffffff',
      strokeWidth: selectedObject.strokeWidth || 0,
      borderStyle: selectedObject.borderStyle || 'solid',
    });
  }, [selectedObject])


  
  //additional
  


  useEffect(() => {
    if(!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();
      if(activeObject){
        setSelectedObject(activeObject);

        //update common properties
        setOpacity(Math.round(activeObject.opacity * 100) || 100);
        setWidth(Math.round(activeObject.width * activeObject.scaleX));
        setHeight(Math.round(activeObject.width * activeObject.scaleY))

        //check based on type
        if(activeObject.type === 'i-text'){
          setObjectType('text');
        }
        else if(activeObject.type === 'image'){
          setObjectType('image');
        }
        else if(activeObject.type === 'path'){
          setObjectType('path');
        }
        else{
          setObjectType('shape');
        }
      }
    }

    const handleSelectionCleared = () => {

    }

    const activeObject = canvas.getActiveObject();
    if(activeObject){
      handleSelectionCreated();
    }

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionCreated);
    canvas.on('object:modified', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionCreated);
      canvas.off('object:modified', handleSelectionCreated);
      canvas.off('selection:cleared', handleSelectionCleared);
    }
  }, [canvas]);

  const updateObjectProperty = (property, value) => {
    if(!canvas || !selectedObject) return;
    
    selectedObject.set(property, value);
    canvas.renderAll();
    markAsModified();
  }

  //opacity
  const handleOpacityChange = (value) => {
    const newValue = Number(value[0]);
    setOpacity(newValue);
    updateObjectProperty('opacity', newValue/100);
    markAsModified();
  }

  //duplicate
  const handleDuplicate = async() => {
    if(!canvas || !selectedObject) return;
    await cloneSelectedObject(canvas);
    markAsModified();
  }

  //delete
  const handleDelete = async() => {
    if(!canvas || !selectedObject) return;
    await deleteSelectedObject(canvas);
    markAsModified();
  }

  //z-index
  const handleBringToFront = async() => {
    if(!canvas || !selectedObject) return;
    await bringToFront(canvas);
    markAsModified();
  }

  const handleSendToBack = async() => {
    if(!canvas || !selectedObject) return;
    await sendToBack(canvas);
    markAsModified();
  }


  //flip
  const handleFlipHorizontal = async() => {
    if(!canvas || !selectedObject) return;

    const flipX = !selectedObject.flipX;
    updateObjectProperty('flipX', flipX);
  }

  const handleFlipVertical = async() => {
    if(!canvas || !selectedObject) return;

    const flipY = !selectedObject.flipY;
    updateObjectProperty('flipY', flipY);
  }





  return (
    <div className='fixed right-0 top-[56px] bottom-[0px] w-[280px] h-full bg-white border-1 border-gray-200 z-10 overflow-auto'>
        <div className='flex items-center justify-between p-3 border-b'>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>Properties</span>
          </div>
        </div>

        <div className='h-[calc(100%-96px)] overflow-auto p-4 space-y-6'>
          <h3 className='text-sm font-medium'>Size & Position</h3>
          {/* WIDTH & HEIGHT */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <Label className={'text-xs'}>Width</Label>
              <div className='h-9 px-3 py-2 border rounded-md flex items-center'>{width}</div>
            </div>

            <div className='space-y-1'>
              <Label className={'text-xs'}>Height</Label>
              <div className='h-9 px-3 py-2 border rounded-md flex items-center'>{height}</div>
            </div>
          </div>

          {/* OPACITY */}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <Label htmlFor='opacity' className={'text-xs'}>Opacity</Label>
              <span>{opacity}%</span>
            </div>
            <Slider id='opacity' min={0} max={100} step={1} value={[opacity]} onValueChange={(value) => handleOpacityChange(value)} />
          </div>

          {/* FLIP HORIZONTAL & VERTICA: */}
          <div className='flex flex-wrap gap-2'>
            <Button onClick={handleFlipHorizontal} variant='outline' size='sm' className={'h-8 text-xs cursor-pointer'}>
              <FlipHorizontal className='h-4 w-4 mr-1' />
              Flip H
            </Button>
            <Button onClick={handleFlipVertical} variant='outline' size='sm' className={'h-8 text-xs cursor-pointer'}>
              <FlipVertical className='h-4 w-4 mr-1' />
              Flip V
            </Button>
          </div>

          {/* Z-Index */}
          <div className='space-y-4 pt-4 border-t'>
            <h3 className='text-sm font-medium'>Layer Position</h3>
            <div className='grid grid-cols-2 gap-2'>
              <Button onClick={handleBringToFront} variant='outline' size='sm' className={'h-8 text-xs cursor-pointer'}>
                <MoveUp className='h-4 w-4' />
                <span>Bring to front</span>
              </Button>
              <Button onClick={handleSendToBack} variant='outline' size='sm' className={'h-8 text-xs cursor-pointer'}>
                <MoveDown className='h-4 w-4' />
                <span>Send to back</span>
              </Button>
            </div>
          </div>

          {/* Duplicate and Delete */}
          <div className='space-y-4 pt-4 border-t'>
            <h3 className='text-sm font-medium'>Layer Position</h3>
            <div className='grid grid-cols-2 gap-2'>
              <Button onClick={handleDuplicate} variant='default' size='sm' className={'h-8 text-xs cursor-pointer'}>
                <Copy className='h-4 w-4' />
                <span>Duplicate</span>
              </Button>
              <Button onClick={handleDelete} variant='destructive' size='sm' className={'h-8 text-xs cursor-pointer'}>
                <Trash className='h-4 w-4' />
                <span>Delete</span>
              </Button>
            </div>
          </div>


          {/* TEXT RELATED PROPERTIES */}
          {
            objectType === 'text' && (
              <div className='space-y-4 border-t'>
                <h3 className='text-sm font-medium'>Text Properties</h3>
                {/* TEXT CONTENT */}
                <div className='space-y-2'>
                  <Label className={'text-xs'} htmlFor='text-content'>Text Content</Label>
                  <Textarea
                    id='text-content'
                    value={textProperties.text}
                    onChange={(e) => handleTextProperties('text', e.target.value)}
                    className={'h-20 resize-none'}
                  />
                </div>

                {/* FONT SIZE */}
                <div className='space-y-2'>
                  <Label className={'text-xs'} htmlFor='font-size'>Font Size</Label>
                  <Input
                    id='text-content'
                    value={textProperties.fontSize}
                    onChange={(e) => handleTextProperties('fontSize', e.target.value)}
                    type='number'
                    className={'w-20 h-7 text-xs'}
                  />
                </div>

                {/* FONT FAMILY */}
                <div className='space-y-2'>
                  <Label htmlFor='font-family' className={'text-sm'}>Font Family</Label>
                  <Select value={textProperties.fontFamily} onValueChange={(value) => handleTextProperties('fontFamily', value)}>
                    <SelectTrigger id='font-family' className={'h-10'}>
                      <SelectValue placeholder='Select Font' />
                      <SelectContent>
                        {
                          fontFamilies.map((fontItem) => (
                            <SelectItem key={fontItem} value={fontItem} style={{fontFamily:fontItem}}>
                              {fontItem}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </div>
                
                {/* FONT STYLES */}
                <div className='space-y-2'>
                  <Label htmlFor='font-weight' className={'text-sm'}>Font Style</Label>
                  <div className='flex gap-2'>
                      <Button className={'cursor-pointer'} variant={textProperties.fontBold ? 'default' : 'outline'} size='icon' onClick={() => handleTextProperties('fontBold', !textProperties.fontBold)}>
                        <Bold />
                      </Button>

                      <Button className={'cursor-pointer'} variant={textProperties.fontItalic ? 'default' : 'outline'} size='icon' onClick={() => handleTextProperties('fontItalic', !textProperties.fontItalic)}>
                        <Italic />
                      </Button>

                      <Button className={'cursor-pointer'} variant={textProperties.underline ? 'default' : 'outline'} size='icon' onClick={() => handleTextProperties('underline', !textProperties.underline)}>
                        <Underline />
                      </Button>
                  </div>
                </div>

                {/* FONT COLORS */}
                <div className='space-y-2 flex justify-between items-center'>
                  <Label className={'text-sm'}>Text Color</Label>
                  <label className="inline-block relative cursor-pointer">
                    <input
                      type="color"
                      value={textProperties.fill}
                      onChange={(e) => handleTextProperties('fill', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span
                      className="block w-10 h-10 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: textProperties.fill }}
                    ></span>
                  </label>
                </div>

                {/* TEXT BACKGROUND */}
                <div className='space-y-2 flex justify-between items-center'>
                  <Label className={'text-sm'}>Background Color</Label>
                  <label className="inline-block relative cursor-pointer">
                    <input
                      type="color"
                      value={textProperties.backgroundColor}
                      onChange={(e) => handleTextProperties('backgroundColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span
                      className="block w-10 h-10 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: textProperties.backgroundColor }}
                    ></span>
                  </label>
                </div>

              </div>
            )
          }



          {/* SHAPE RELATED PROPERTIES */}
          {
            objectType === 'shape' && (
              <div className='space-y-4 p-4 border-t'>
                <h3 className='text-sm font-medium'>Shape Properties</h3>

                <div className='space-y-2 flex justify-between items-center'>
                  <Label htmlFor='fill-color' className={'text-xs'}>Fill Color</Label>
                  <label className="inline-block relative cursor-pointer">
                    <input
                      type="color"
                      value={shapeProperties.fill}
                      onChange={(e) => handleShapeProperties('fill', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span
                      className="block w-10 h-10 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: shapeProperties.fill }}
                    ></span>
                  </label>
                </div>

                <div className='space-y-2 flex justify-between items-center'>
                  <Label htmlFor='fill-color' className={'text-xs'}>Border Color</Label>
                  <label className="inline-block relative cursor-pointer">
                    <input
                      type="color"
                      value={shapeProperties.stroke}
                      onChange={(e) => handleShapeProperties('stroke', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span
                      className="block w-10 h-10 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: shapeProperties.stroke }}
                    ></span>
                  </label>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='fill-color' className={'text-xs'}>Border Width</Label>
                  <div className='flex justify-between items-center gap-2'>
                    <Slider value={[shapeProperties.strokeWidth]} onValueChange={(value) => handleShapeProperties('strokeWidth', value[0])} min={0} max={30} />
                    <span>{shapeProperties.strokeWidth}</span>
                  </div>
                </div>


              </div>
            )
          }


          {/* PATH RELATED PROPERTIES */}
          {
            objectType === 'path' && (
              <div>
                
              </div>
            )
          }

        </div>
    </div>
    
  )
}

export default EditorProperties
