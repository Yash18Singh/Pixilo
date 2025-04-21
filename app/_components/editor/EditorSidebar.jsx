"use client"
import { ArrowLeft, ChevronLeft, Grid, Pencil, Settings, Sparkle, Type, Upload } from 'lucide-react';
import React, { useState } from 'react'
import ElementsPanel from './panels/ElementsPanel';
import TextPanel from './panels/TextPanel';
import UploadPanel from './panels/UploadPanel';
import DrawPanel from './panels/DrawPanel';
import SettingsPanel from './panels/SettingsPanel';
import AiPanel from './panels/AiPanel';



const EditorSidebar = () => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [shapesColor, setShapesColor] = useState('#000000');

  const sidebarItems = [
    {
      id:'elements',
      icon: Grid,
      label: 'Elements',
      panel: () => <ElementsPanel shapeColor={shapesColor} />
    },
    {
      id:'text',
      icon: Type,
      label: 'Text',
      panel: () => <TextPanel />
    },
    {
      id:'upload',
      icon: Upload,
      label: 'Upload',
      panel: () => <UploadPanel />
    },
    {
      id:'draw',
      icon: Pencil,
      label: 'Draw',
      panel: () => <DrawPanel />
    },
    {
      id:'ai',
      icon: Sparkle,
      label: 'AI',
      panel: () => <AiPanel />
    },
    {
      id:'settings',
      icon: Settings,
      label: 'Settings',
      panel: () => <SettingsPanel />
    },
  ]

  const handleItemClick = (id) => {
    if(id === activeSidebar){
      setIsPanelCollapsed(!isPanelCollapsed);
      return;
    }

    setActiveSidebar(id);
    setIsPanelCollapsed(false);
  }

  const closeSecondaryPanel = () => {
    setActiveSidebar(null);
  }

  const togglePanelCollapse = (e) => {
    e.stopPropagation();
    setIsPanelCollapsed(!isPanelCollapsed);
  }

  const activeItem = sidebarItems.find((item) => item.id === activeSidebar);

  return (
    <div className='flex h-full'>
      <aside className='sidebar'>
         {
            sidebarItems.map((item, index) => (
              <div onClick={() => handleItemClick(item.id)} key={item.id} className={`sidebar-item ${activeSidebar === item.id ? 'active' : ''}`}>
                <item.icon className='sidebar-item-icon h-5 w-5' />
                <span className='sidebar-item-label'>{item.label}</span>
              </div>
            ))
         }
      </aside>
      {
          activeSidebar && 
            <div 
              className={`secondary-panel ${isPanelCollapsed ? 'collapsed' : ''}`} 
              style={{
                width: isPanelCollapsed ? '0' : '320px',
                opacity: isPanelCollapsed ? 0 : 1,
                overflow: isPanelCollapsed ? 'hidden' : 'visible',
                transition: 'all 0.3s ease'
              }}
            >
              <div className='panel-header flex justify-between items-center'>
                {/* <button className='back-button' onClick={() => closeSecondaryPanel()}>
                  <ArrowLeft className='h-5 w-5' />
                </button> */}
                <span className='panel-title'>{activeItem.label}</span>
                {/* {
                  activeItem.label === 'Elements' &&
                    <label className="inline-block relative cursor-pointer">
                      <input
                        type="color"
                        value={shapesColor}
                        onChange={(e) => setShapesColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <span
                        className="block w-10 h-10 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: shapesColor }}
                      ></span>
                    </label>
                } */}
              </div>

              <div className='panel-content'>
                {activeItem.panel()}
              </div>

              <button className='collapse-button' onClick={togglePanelCollapse}>
                <ChevronLeft className='h-5 w-5' />
              </button>
            </div>
      }
    </div>
  )
}

export default EditorSidebar
