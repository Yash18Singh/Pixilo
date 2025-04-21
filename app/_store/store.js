'use client'

import { create } from "zustand"
import { centerCanvas } from "../_fabric/fabric-utils";
import { saveCanvasState } from "../_services/design-service";
import { debounce } from "lodash";

export const useEditorStore = create((set, get) => ({
    canvas: null,
    setCanvas: (canvas) => {
        set({canvas});
        if(canvas){
            centerCanvas(canvas);
        }
    },

    designId: null,
    setDesignId: (id) => set({designId: id}),

    isEditing: true,
    setIsEditing: (flag) => set({isEditing: flag}),

    name: 'Untitled Design',
    setName: (value) => set({name: value}),

    showProperties: false,
    setShowProperties: (flag) => set({showProperties: flag}),

    saveStatus: 'Saved',
    setSaveStatus : (status) => set({saveStatus: status}),
    lastModified: Date.now(),
    isModified: false,


    markAsModified: () => {
        const designId = get().designId

        if(designId){
            set({
                lastModified: Date.now(),
                saveStatus: 'Saving...',
                isModified: true,
            })

            get().debouncedSaveToServer();
        } else{
            console.log("NO DESIGN ID");
        }
    },

    saveToServer: async() => {
        const designId = get().designId;
        const canvas = get().canvas;

        if(!canvas || !designId){
            console.log("NO DESIGN ID OR CANVAS NOT AVAILABLE");
            return null;
        }

        try {
            const savedDesign = await saveCanvasState(canvas, designId, get().name);
            set({
                saveStatus: 'Saved',
                isModified: false,
            });

            return savedDesign;
        } catch (error) {
            set({
                saveStatus: 'Error'
            })
            return null;
        }
    },

    debouncedSaveToServer : debounce(() => {
        get().saveToServer()
    }, 500),


    userSubscription : null,
    setUserSubscription: (data) => set({userSubscription: data}),

    designsCount: 0,
    setDesignsCount: (value) => set({designsCount: value}),

    resetStore : () => {
        set({
            canvas: null,
            designId: null,
            isEditing: true,
            name: 'Untitled Design',
            showProperties: false,
            saveStatus: 'Saved',
            isModified: false,
        })
    }
}))