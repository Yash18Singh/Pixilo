'use client'
import { exportAsJson, exportAsPdf, exportAsPng, exportAsSvg } from '@/app/_services/export-service'
import { useEditorStore } from '@/app/_store/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Download, FileIcon, FileImage, FileJson, FileText, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

const EditorExport = ({isOpen, onClose}) => {
    const {canvas} = useEditorStore();

    const [selectedFormat, setSelectedFormat] = useState('png');
    const [isExporting, setIsExporting] = useState(false);
    const [fileName, setFileName] = useState('');

    const exportFormats = [
        {
            id: 'png',
            name: 'PNG Image',
            icon: FileImage,
            description: 'Best for web and Social Media'
        },
        {
            id: 'svg',
            name: 'SVG Vector',
            icon: FileIcon,
            description: 'Scalable vector format'
        },
        {
            id: 'pdf',
            name: 'PDF Document',
            icon: FileText,
            description: 'Best for printing'
        },
        {
            id: 'json',
            name: 'JSON Template',
            icon: FileJson,
            description: 'Editable template format'
        },
    ];

    const handleDownload = async() => {
        if(!canvas) return;
        setIsExporting(true);

        try {
            let successFlag = false;

            switch(selectedFormat){
                case 'json':
                    successFlag = exportAsJson(canvas, fileName || `Pixilo-${Date.now()}`);
                    break;
                case 'png':
                    successFlag = exportAsPng(canvas, fileName || `Pixilo-${Date.now()}`);
                    break;
                case 'svg':
                    successFlag = exportAsSvg(canvas, fileName || `Pixilo-${Date.now()}`);
                    break;
                case 'pdf':
                    successFlag = exportAsPdf(canvas, fileName || `Pixilo-${Date.now()}`);
                    break;
                default: break;
            }

            if(successFlag){
                setTimeout(() => {
                    onClose();
                }, 500);
            }
        } catch (error) {
            console.log("ERROR DOWNLOADING FILE", error);
        } finally {
            setIsExporting(false);
        }
    }

    if(!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={'sm:max-w-md'}>
            <DialogHeader>
                <DialogTitle className={'text-xl'}>
                    Export Design
                </DialogTitle>
            </DialogHeader>

            <div className='py-4'>
                <h3 className='text-xs font-medium mb-3'>Choose Format</h3>
                <div className='grid grid-cols-2 gap-3'>
                    {
                        exportFormats.map((item, index) => (
                            <Card key={item.id} 
                                className={cn('cursor-pointer border transition-colors hover:bg-accent hover:text-accent-foreground', selectedFormat === item.id ? 'border-primary bg-accent' : 'border-border')}
                                onClick={() => setSelectedFormat(item.id)}
                            >
                                <CardContent className={'p-4 gap-2 flex flex-col items-center text-center'}>
                                    <item.icon className='h-10 w-10' />
                                    <h4 className='font-bold text-lg'>{item.name}</h4>
                                    <p className='text-sm'>{item.description}</p>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </div>

            <div>
                <Input type='text' placeholder='Custom File Name...' value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </div>

            <DialogFooter>
                <Button onClick={handleDownload} disabled={isExporting} className={'min-w-[120px] bg-purple-600 text-white hover:bg-purple-800 hover:text-white cursor-pointer'} variant='outline'>
                    {
                        isExporting ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4' />
                                Exporting
                            </>
                        ) : (
                            <>
                                <Download className='mr-2 h-4 w-4' />
                                Export {selectedFormat.toUpperCase()}
                            </>
                        )
                    }
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default EditorExport
