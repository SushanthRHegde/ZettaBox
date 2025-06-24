import React, { useState } from 'react';
import { Upload, FileUp, FileDown, Check, AlertCircle, Trash2, Download, RefreshCw, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import PDFMergerLib from 'pdf-merger-js/browser';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PDFMerger: React.FC = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'merge' | 'split'>('merge');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const resetState = () => {
    setFiles([]);
    setError(null);
    setSuccess(false);
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      if (newFiles.length === 0) {
        setError('Please upload PDF files only');
        return;
      }
      setFiles(prev => [...prev, ...newFiles]);
      setError(null);
      setSuccess(false);
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
        setMergedPdfUrl(null);
      }
    }
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setSuccess(false);
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFiles(items);
  };

  // Handle merge operation
  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please upload at least two PDF files to merge');
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      const merger = new PDFMergerLib();

      for (const file of files) {
        await merger.add(file);
      }

      const mergedPdf = await merger.saveAsBlob();
      const url = URL.createObjectURL(mergedPdf);
      setMergedPdfUrl(url);
      setSuccess(true);
      toast({
        title: 'Success',
        description: 'PDFs merged successfully!',
      });
    } catch (err) {
      setError('An error occurred while merging the files');
      toast({
        title: 'Error',
        description: 'Failed to merge PDFs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (mergedPdfUrl) {
      const link = document.createElement('a');
      link.href = mergedPdfUrl;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">PDF {mode === 'merge' ? 'Merger' : 'Splitter'}</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center max-w-md mx-auto px-2 sm:px-4">
          {mode === 'merge' ? 'Combine multiple PDF files into one' : 'Split a PDF file into multiple documents'}
        </p>
    
        {/* Mode Toggle */}
        <div className="flex w-full max-w-[280px] sm:max-w-xs rounded-lg overflow-hidden border">
          <button
            onClick={() => { setMode('merge'); resetState(); }}
            className={cn(
              'flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors',
              mode === 'merge' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            )}
          >
            Merge PDFs
          </button>
          <button
            onClick={() => { setMode('split'); resetState(); }}
            className={cn(
              'flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors',
              mode === 'split' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            )}
          >
            Split PDF
          </button>
        </div>
      </div>
    
      {!success && (
        <>
          {/* File Upload Area */}
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-3 sm:p-4 md:p-6',
              'flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4',
              'cursor-pointer hover:border-primary/50 transition-colors'
            )}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              multiple={mode === 'merge'}
              onChange={handleFileUpload}
            />
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-xs sm:text-sm md:text-base font-medium">
                {mode === 'merge' ? 'Upload PDF files to merge' : 'Upload a PDF file to split'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Click or drag and drop PDF files
          </p>
          {mode === 'merge' && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Use the grip handle to drag and rearrange the order of PDFs for merging
            </p>
          )}
          {mode === 'merge' && files.length > 0 && (
            <p className="text-xs sm:text-sm text-primary mt-2">
              ↕️ Drag files to set the order for merging
            </p>
          )}
            </div>
          </div>
    
          {/* File List */}
          {files.length > 0 && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="pdf-files">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-1.5 sm:space-y-2"
                  >
                    {files.map((file, index) => (
                      <Draggable key={index} draggableId={`file-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between p-1.5 sm:p-2 md:p-3 bg-accent/50 rounded-lg group hover:bg-accent/70 transition-colors"
                          >
                            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-1 min-w-0">
                              <div
                                {...provided.dragHandleProps}
                                className="p-0.5 sm:p-1 rounded hover:bg-accent/80 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground" />
                              </div>
                              <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 min-w-0">
                                <span className="text-xs sm:text-sm font-medium text-primary shrink-0">{index + 1}.</span>
                                <FileUp className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px]">
                                  {file.name}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="text-destructive hover:text-destructive/80 transition-colors ml-2 flex-shrink-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={handleMerge}
            disabled={processing || files.length < 2}
            className={cn(
              'w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all transform',
              'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[0.99]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'flex items-center justify-center space-x-2',
              processing && 'animate-pulse'
            )}
          >
            {processing ? (
              <>
                <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm sm:text-base">Merging PDFs...</span>
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Merge PDF Files</span>
              </>
            )}
          </button>
        </>
      )}

      {/* Success Message with Download and Reset */}
      {success && mergedPdfUrl && (
        <div className="flex flex-col space-y-3 sm:space-y-4 p-4 sm:p-6 bg-background rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2 text-foreground">
            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <p className="text-sm sm:text-base font-medium">PDF files merged successfully!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleDownload}
              className={cn(
                'flex items-center justify-center space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'transition-all duration-200 ease-in-out transform hover:scale-[0.98]',
                'text-sm sm:text-base flex-1'
              )}
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Download Merged PDF</span>
            </button>
            <button
              onClick={resetState}
              className={cn(
                'flex items-center justify-center space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium',
                'bg-secondary text-secondary-foreground hover:bg-secondary/90',
                'transition-all duration-200 ease-in-out transform hover:scale-[0.98]',
                'text-sm sm:text-base flex-1'
              )}
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Start New Merge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFMerger;