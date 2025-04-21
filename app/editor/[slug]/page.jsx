"use client"
import EditorMain from '@/app/_components/editor/EditorMain'
import { useEditorStore } from '@/app/_store/store'
import React, {useEffect} from 'react'


const EditorPage = () => {
  const {name} = useEditorStore();

  useEffect(() => {
    if(name){
      document.title = `Pixilo | ${name}` ;
    }
  }, [name]);

  return (
    <div>
      <EditorMain />
    </div>
  )
}

export default EditorPage
