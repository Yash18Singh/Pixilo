import { FabricImage } from 'fabric';
import { shapeDef } from './shapes/ShapeDef';
import { createShape } from './shapes/ShapeFactory';


export const initializeFabric = async(canvasElement, containerElement) => {
    try {
        const {Canvas, PencilBrush} = await import('fabric');

        const canvas = new Canvas(canvasElement, {
            preserveObjectStacking: true,
            isDrawingMode: false,
            renderOnAddRemove: true,
        });

        //drawing init
        const brush = new PencilBrush(canvas);
        brush.color = '#000000';
        brush.width = 5;
        canvas.freeDrawingBrush = brush;

        return canvas;

    } catch (error) {
        console.log('FAILED TO LOAD FABRIC', error);
        return null;
    }
};


export const centerCanvas = (canvas) => {
    if(!canvas || !canvas.wrapperEl){
        return;
    }

    const canvasWrapper = canvas.wrapperEl;
    canvasWrapper.style.width = `${canvas.width}px`;
    canvasWrapper.style.height = `${canvas.height}px`

    canvasWrapper.style.position = 'absolute';
    canvasWrapper.style.left = '50%';
    canvasWrapper.style.top = '50%';
    canvasWrapper.style.transform = 'translate(-50%, -50%)';
};


export const addShapeToCanvas = async(canvas, shapeType, customProps={}) => {
    if(!canvas) return null;

    try {
        const fabricModule = await import('fabric');
        const shape = createShape(fabricModule, shapeType, shapeDef, {
            left: 100,
            top:100,
            ...customProps
        })

        if(shape){
            shape.id = `${shapeType}-${Date.now()}`;
            canvas.add(shape);
            canvas.setActiveObject(shape);
            canvas.renderAll();
            return shape;
        }
    } catch (error) {
        console.log('NOT ABLE TO GET SHAPE ON CANVAS :', error);
    }
};


export const addTextToCanvas = async(canvas, text, options={}, withBackground=false) => {
    if(!canvas) return null;
    
    try {
        const {IText} = await import('fabric');
        const defautProps = {
            left:100,
            top:100,
            fontSize:24,
            fontFamily: 'Arial',
            fill: '#000000',
            padding: withBackground ? 10 : 0,
            textAlign: 'left',
            id: `text-${Date.now()}`
        }

        const textObj = new IText(text, {
            ...defautProps,
            ...options,
        })

        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.renderAll();

        return textObj;

    } catch (error) {
        console.log('UNABLE TO ADD TEXT TO CANVAS :', error);
    }
};


export const addImageToCanvas = async(canvas, imageUrl) => {
    if(!canvas) return null;

    try {
        const {Image: FabricImage} = await import('fabric');

        let imgObj = new Image();
        imgObj.crossOrigin = 'Anonymous';
        imgObj.src = imageUrl;

        return new Promise((resolve, reject) => {
            imgObj.onload = () => {
                let image = new FabricImage(imgObj);
                image.set({
                    id: `image-${Date.now()}`,
                    top: 100,
                    left: 100,
                    padding: 10,
                    cornerSize: 10,
                });

                const maxDimension = 400;

                if(image.width > maxDimension || image.height > maxDimension){
                    if(image.width > image.height){
                        const scale = maxDimension/image.width;
                        image.scale(scale);
                    }
                    else{
                        const scale = maxDimension/image.height;
                        image.scale(scale);
                    }
                }

                canvas.add(image);
                canvas.setActiveObject(image);
                canvas.renderAll();
                resolve(image);
            }

            imgObj.onerror = () => {
                reject(new Error('Failed to load image', imageUrl));
            }
        })

    } catch (error) {
        console.log('ERROR ADDING IMAGE ON CANVAS', error);
    }
};


export const toggleDrawingMode = async(canvas, isDrawingMode, drawingColor='#000000', brushWidth) => {
    if(!canvas) return null;

    try {
        canvas.isDrawingMode = isDrawingMode;
        if(isDrawingMode){
            canvas.freeDrawingBrush.color = drawingColor;
            canvas.freeDrawingBrush.width = brushWidth
        }
        return true;
    } catch (error) {
        return false;
    }
};


export const toggleEraseMode = async(canvas, isErasing, prevColor='#000000', eraserWidth=20) => {
    if(!canvas || !canvas.freeDrawingBrush) return false;

    try {
        if(isErasing){
            canvas.freeDrawingBrush.color = '#ffffff';
            canvas.freeDrawingBrush.width = eraserWidth;
        } else{
            canvas.freeDrawingBrush.color = prevColor;
            canvas.freeDrawingBrush.width = 5;
        }

        return true;
    } catch (error) {
        return false;
    }
};


export const updateDrawingBrush = async(canvas, properties={}) => {
    if(!canvas || !canvas.freeDrawingBrush) return false;

    try {
        const {color, width, opacity} = properties;
        if(color !== undefined){
            canvas.freeDrawingBrush.color = color;
        }
        if(width !== undefined){
            canvas.freeDrawingBrush.width = width;
        }
        if(opacity !== undefined){
            canvas.freeDrawingBrush.opacity = opacity;
        }

        return true;

    } catch (error) {
        return false;
    }
};


export const cloneSelectedObject = async(canvas) => {
    if(!canvas) return;

    const activeObject = canvas.getActiveObject();
    if(!activeObject) return;

    try {
        const clonedObject = await activeObject.clone();
        clonedObject.set({
            left: activeObject.left + 10,
            top: activeObject.top + 10,
            id: `${activeObject.type || 'object'}-${Date.now()}`
        });

        canvas.add(clonedObject);
        canvas.setActiveObject(clonedObject)
        canvas.renderAll();

        return clonedObject;
    } catch (error) {
        console.log('ERROR WHILE CLONING :', error);
        return null;
    }
};


export const deleteSelectedObject = async(canvas) => {
    if(!canvas) return;

    const activeObject = canvas.getActiveObject();
    if(!activeObject) return;

    try {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();

        return true;
    } catch (error) {
        console.log('ERROR WHILE DELETING :', error);
        return null;
    }
};


export const bringToFront = async(canvas) => {
    if(!canvas) return;

    const activeObject = canvas.getActiveObject();
    if(!activeObject) return;

    try {
        canvas.bringObjectToFront(activeObject);
        canvas.renderAll();

        return true;

    } catch (error) {
        console.log('ERROR WHILE BRINGING TO FRONT :', error);
        return null;
    }
};

export const sendToBack = async(canvas) => {
    if(!canvas) return;

    const activeObject = canvas.getActiveObject();
    if(!activeObject) return;

    try {
        canvas.sendObjectToBack(activeObject);
        canvas.renderAll();

        return true;

    } catch (error) {
        console.log('ERROR WHILE BRINGING TO FRONT :', error);
        return null;
    }
};


