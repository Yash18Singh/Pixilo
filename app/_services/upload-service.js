import axios from "axios";
import { getSession } from "next-auth/react";
import { fetchWithAuth } from "./base-service";

const API_URL = process.env.API_URL || 'https://pixilo-server.onrender.com';

export async function uploadFileWithAuth(file, metaData={}){
    const session = await getSession();

    if(!session){
        throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    Object.entries(metaData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        const response = await axios.post(`${API_URL}/media/upload`, formData, {
            headers: {
                Authorization: `Bearer ${session.idToken}`,
                "Content-Type": 'multipart/form-data'
            }
        });

        return response.data;

    } catch (error) {
        throw new Error('Upload Failed')
    }
};


export async function generateImageFromAI(prompt){
    try {
        const response = await fetchWithAuth('/media/ai-image-generate', {
            method: 'POST',
            body: {
                prompt,
            }
        });

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}