import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bold, Italic, Underline, ZoomIn, ZoomOut, Upload } from 'lucide-react';
import { SketchPicker } from 'react-color';

// Import PDF.js worker and styles
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Annotation {
  type: 'text' | 'draw' | 'highlight';
  content: string;
  position: { x: number; y: number };
  style: React.CSSProperties;
  page: number;
  scale?: number; // Added scale property
}

interface HighlightAnnotation extends Annotation {
  type: 'highlight';
  width: number;
  height: number;
}

interface TextOptions {
  fontFamily: string;
  fontSize: number;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

const PDFEditor: React.FC = (): React.ReactNode => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation] = useState<number>(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentTool, setCurrentTool] = useState<'text' | 'draw' | 'highlight'>('text');
  const [textOptions, setTextOptions] = useState<TextOptions>({
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000',
    isBold: false,
    isItalic: false,
    isUnderline: false
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingContextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Handle file load and cleanup
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
      setError(null);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFile, setPdfUrl, setError]);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = textOptions.color;
        context.lineWidth = 2;
        context.lineCap = 'round';
        drawingContextRef.current = context;
      }
    }
  }, [textOptions.color]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }, [setNumPages, setPageNumber, setError]);

  const onDocumentLoadError = useCallback((error: Error) => {
    setError(`Error loading PDF: ${error.message}`);
  }, [setError]);

  const handlePageChange = useCallback((offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(newPageNumber, numPages));
    });
  }, [numPages, setPageNumber]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else if (file) {
      setError('Please select a valid PDF file');
    }
  }, [setSelectedFile, setError]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else if (file) {
      setError('Please drop a valid PDF file');
    }
  }, [setSelectedFile, setError]);

  // Scale position based on current zoom level
  const getScaledPosition = useCallback((x: number, y: number) => {
    return {
      x: x / scale,
      y: y / scale
    };
  }, [scale]);

  // Add Text Annotation
  const addTextAnnotation = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (currentTool !== 'text') return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const scaledPosition = getScaledPosition(
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    const style: React.CSSProperties = {
      fontFamily: textOptions.fontFamily,
      fontSize: `${textOptions.fontSize}px`,
      color: textOptions.color,
      fontWeight: textOptions.isBold ? 'bold' : 'normal',
      fontStyle: textOptions.isItalic ? 'italic' : 'normal',
      textDecoration: textOptions.isUnderline ? 'underline' : 'none',
      cursor: 'text',
      userSelect: 'text',
      position: 'absolute',
      minWidth: '100px',
      minHeight: '24px',
      padding: '4px 8px',
      border: '1px solid transparent',
      outline: 'none',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      backgroundColor: 'transparent',
      zIndex: 1000,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      borderRadius: '4px',
      transition: 'border-color 0.2s ease-in-out'
    };

    const newAnnotation: Annotation = {
      type: 'text',
      content: '',
      position: scaledPosition,
      style,
      page: pageNumber,
      scale
    };

    setAnnotations(prev => [...prev, newAnnotation]);
  }, [currentTool, textOptions, scale, pageNumber, getScaledPosition, setAnnotations]);

  // Draw handlers with improved coordinate handling
  const handleDrawStart = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 'draw' || !canvasRef.current || !drawingContextRef.current) return;

    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (event.clientY - rect.top) * (canvasRef.current.height / rect.height);
    
    drawingContextRef.current.beginPath();
    drawingContextRef.current.moveTo(x, y);
  }, [currentTool, canvasRef, drawingContextRef, setIsDrawing]);

  const handleTextOptionsChange = useCallback((option: keyof TextOptions, value: any) => {
    setTextOptions(prev => {
      const newOptions = { ...prev, [option]: value };
      // Update existing text annotations with new styles
      setAnnotations(prevAnnotations =>
        prevAnnotations.map(ann => {
          if (ann.type === 'text') {
            return {
              ...ann,
              style: {
                ...ann.style,
                fontFamily: newOptions.fontFamily,
                fontSize: `${newOptions.fontSize}px`,
                color: newOptions.color,
                fontWeight: newOptions.isBold ? 'bold' : 'normal',
                fontStyle: newOptions.isItalic ? 'italic' : 'normal',
                textDecoration: newOptions.isUnderline ? 'underline' : 'none'
              }
            };
          }
          return ann;
        })
      );
      return newOptions;
    });
  }, [setAnnotations]);

  const handleDrawMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !drawingContextRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (event.clientY - rect.top) * (canvasRef.current.height / rect.height);
    
    drawingContextRef.current.lineTo(x, y);
    drawingContextRef.current.stroke();
  }, [isDrawing]);

  const handleDrawEnd = useCallback(() => {
    if (currentTool !== 'draw' || !isDrawing || !canvasRef.current) return;
    
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    
    const newAnnotation: Annotation = {
      type: 'draw',
      content: '',
      position: { x: 0, y: 0 },
      style: {
        backgroundImage: `url(${dataUrl})`,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      },
      page: pageNumber,
      scale
    };

    setAnnotations(prev => [...prev, newAnnotation]);

    // Clear the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [currentTool, isDrawing, pageNumber, scale, setAnnotations, setIsDrawing]);

  // Highlight handler with scale support
  const handleHighlight = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (currentTool !== 'highlight') return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const scaledPosition = getScaledPosition(
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    const newAnnotation: HighlightAnnotation = {
      type: 'highlight',
      content: '',
      position: scaledPosition,
      width: 150 / scale,
      height: 24 / scale,
      style: {
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        position: 'absolute',
        pointerEvents: 'none',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: '2px'
      },
      page: pageNumber,
      scale
    };

    setAnnotations(prev => [...prev, newAnnotation]);
  }, [currentTool, scale, pageNumber]);

  // Handle zoom change
  useEffect(() => {
    setAnnotations(prevAnnotations =>
      prevAnnotations.map(ann => ({
        ...ann,
        style: {
          ...ann.style,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        },
        scale
      }))
    );
  }, [scale, setAnnotations]);

  // Edit annotation (text)
  const editAnnotation = useCallback((index: number, content: string) => {
    setAnnotations(prev => prev.map((ann, i) =>
      i === index ? {
        ...ann,
        content,
        style: {
          ...ann.style,
          border: '1px solid transparent'
        }
      } : ann
    ));
  }, [setAnnotations]);

  // Save PDF (link to download original for now)
  const handleSave = useCallback(() => {
    if (!pdfUrl || !selectedFile) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = selectedFile.name || 'edited-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl, selectedFile]);

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!selectedFile ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="text-xl font-semibold">Drag and drop your PDF here</h3>
            <p className="text-sm text-gray-500">or</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto"
            >
              Choose file
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(prev => Math.min(3.0, prev + 0.2))}
                disabled={scale >= 3.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-gray-200 mx-2" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(-1)}
                disabled={pageNumber <= 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={pageNumber >= numPages}
              >
                Next
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select onValueChange={(value) => setCurrentTool(value as 'text' | 'draw' | 'highlight')}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                  <SelectItem value="highlight">Highlight</SelectItem>
                </SelectContent>
              </Select>

              {currentTool === 'text' && (
                <div className="flex items-center gap-2">
                  <Select onValueChange={(value) => handleTextOptionsChange('fontFamily', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times-Roman">Times New Roman</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleTextOptionsChange('fontSize', parseInt(value))}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-8 h-8 p-0" style={{ backgroundColor: textOptions.color }}>
                        <span className="sr-only">Pick a color</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <SketchPicker
                        color={textOptions.color}
                        onChange={(color) => handleTextOptionsChange('color', color.hex)}
                      />
                    </PopoverContent>
                  </Popover>

                  <Button
                    variant="outline"
                    size="icon"
                    className={textOptions.isBold ? 'bg-gray-200' : ''}
                    onClick={() => handleTextOptionsChange('isBold', !textOptions.isBold)}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={textOptions.isItalic ? 'bg-gray-200' : ''}
                    onClick={() => handleTextOptionsChange('isItalic', !textOptions.isItalic)}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={textOptions.isUnderline ? 'bg-gray-200' : ''}
                    onClick={() => handleTextOptionsChange('isUnderline', !textOptions.isUnderline)}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="relative border rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
            {pdfUrl && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="mx-auto"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  className="mx-auto"
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                  onClick={e => {
                    switch (currentTool) {
                      case 'text':
                        addTextAnnotation(e as React.MouseEvent<HTMLDivElement>);
                        break;
                      case 'highlight':
                        handleHighlight(e as React.MouseEvent<HTMLDivElement>);
                        break;
                    }
                  }}
                  onLoadSuccess={(page) => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      canvas.width = page.width * scale;
                      canvas.height = page.height * scale;
                      
                      // Reset drawing context after canvas resize
                      const context = canvas.getContext('2d');
                      if (context) {
                        context.strokeStyle = textOptions.color;
                        context.lineWidth = 2;
                        context.lineCap = 'round';
                        drawingContextRef.current = context;
                      }
                    }
                  }}
                />
              </Document>
            )}

            {currentTool === 'draw' && (
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                onMouseDown={handleDrawStart}
                onMouseMove={handleDrawMove}
                onMouseUp={handleDrawEnd}
                onMouseLeave={handleDrawEnd}
              />
            )}

            {annotations.map((annotation, index) => (
              annotation.page === pageNumber && (
                <div
                  key={index}
                  className={`absolute ${annotation.type === 'text' ? 'hover:border-blue-400 focus:border-blue-500 focus:outline-none' : ''}`}
                  style={{
                    left: annotation.position.x,
                    top: annotation.position.y,
                    ...annotation.style
                  }}
                  contentEditable={annotation.type === 'text'}
                  suppressContentEditableWarning
                  onFocus={(e) => {
                    if (annotation.type === 'text') {
                      e.currentTarget.style.border = '1px solid #3b82f6';
                    }
                  }}
                  onBlur={(e) => {
                    if (annotation.type === 'text') {
                      e.currentTarget.style.border = '1px solid transparent';
                      editAnnotation(index, e.currentTarget.textContent || '');
                    }
                  }}
                  onClick={(e) => {
                    if (annotation.type === 'text') {
                      e.currentTarget.focus();
                      e.stopPropagation();
                    }
                  }}
                >
                  {annotation.content}
                </div>
              )
            ))}
          </div>
          <Button onClick={handleSave} className="mt-2">
            Download PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFEditor;