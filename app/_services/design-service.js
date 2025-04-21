import { fetchWithAuth } from "./base-service";


export async function getUserDesigns(){
    return fetchWithAuth('/api/designs', {
        method: 'GET'
    })
};

export async function getUserDesignByID(designId){
    return fetchWithAuth(`/api/designs/${designId}`, {
        method: 'GET'
    })
};

export async function saveDesign(designData, designId=null){
    return fetchWithAuth(`/api/designs`, {
        method: 'POST',
        body: {
            ...designData,
            designId
        }
    })
};


export async function deleteDesign(designId){
    return fetchWithAuth(`/api/designs/${designId}`, {
        method: 'DELETE'
    })
};


export async function saveCanvasState(canvas, designId=null, title="Untitled Design"){
    if(!canvas) return false;

    try {
        const canvasData = canvas.toJSON(['id', 'filters']);

        const designData = {
            name: title,
            canvasData: JSON.stringify(canvasData),
            width: canvas.width,
            height: canvas.height,
        }

        return saveDesign(designData, designId);

    } catch (error) {
        console.log("ERROR SAVING CANVAS", error);
    }
}