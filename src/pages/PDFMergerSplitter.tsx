import React, { useState, useEffect } from 'react';
import { Upload, FileUp, FileDown, Check, AlertCircle, Trash2, Download, RefreshCw, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import PDFMergerLib from 'pdf-merger-js/browser';
import { PDFDocument } from 'pdf-lib';
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
  const [splitPdfUrls, setSplitPdfUrls] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [startPage, setStartPage] = useState<string>('');
  const [endPage, setEndPage] = useState<string>('');

  const resetState = () => {
    setFiles([]);
    setError(null);
    setSuccess(false);
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
      setMergedPdfUrl(null);
    }
    // Clean up split PDF URLs
    splitPdfUrls.forEach(url => URL.revokeObjectURL(url));
    setSplitPdfUrls([]);
    setTotalPages(0);
    setStartPage('');
    setEndPage('');
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

  // Update total pages when file changes
  useEffect(() => {
    const updateTotalPages = async () => {
      if (files.length === 1 && mode === 'split') {
        try {
          const file = files[0];
          const fileArrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileArrayBuffer);
          const pages = pdfDoc.getPageCount();
          setTotalPages(pages);
          setStartPage('1');
          setEndPage(String(pages));
        } catch (err) {
          setError('Error reading PDF file');
        }
      } else {
        setTotalPages(0);
        setStartPage('');
        setEndPage('');
      }
    };
    updateTotalPages();
  }, [files, mode]);

  // Handle split operation
  const handleSplit = async () => {
    if (files.length !== 1) {
      setError('Please upload exactly one PDF file to split');
      return;
    }

    const start = parseInt(startPage);
    const end = parseInt(endPage);

    if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
      setError(`Please enter valid page numbers between 1 and ${totalPages}`);
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      const file = files[0];
      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const newPdfDoc = await PDFDocument.create();
      
      // Copy the selected range of pages
      const pageIndexes = Array.from(
        { length: end - start + 1 },
        (_, i) => start - 1 + i
      );
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndexes);
      copiedPages.forEach(page => newPdfDoc.addPage(page));
      
      const pdfBytes = await newPdfDoc.save();
      const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      setSplitPdfUrls([url]);
      setSuccess(true);
      toast({
        title: 'Success',
        description: `PDF pages ${start} to ${end} extracted successfully!`,
      });
    } catch (err) {
      setError('An error occurred while splitting the file');
      toast({
        title: 'Error',
        description: 'Failed to split PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
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

  // Handle download split PDFs
  const handleDownloadSplit = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `split-pages-${startPage}-to-${endPage}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle download merged PDF
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
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
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
                              {mode === 'merge' && (
                <div
                  {...provided.dragHandleProps}
                  className="p-0.5 sm:p-1 rounded hover:bg-accent/80 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground" />
                </div>
              )}
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

          {/* Page Range Selection */}
          {mode === 'split' && files.length === 1 && (
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center bg rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap">From page:</label>
                  <input
                    type="number"
                    value={startPage}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setStartPage('');
                        return;
                      }
                      const num = parseInt(value);
                      if (num >= 1 && num <= totalPages) {
                        setStartPage(value);
                        setError(null);
                        // Adjust end page if it's less than start page
                        const endNum = parseInt(endPage);
                        if (endNum < num) {
                          setEndPage(value);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (startPage === '') {
                        setStartPage('1');
                      }
                    }}
                    min={1}
                    max={totalPages}
                    className="w-24 px-4 py-2 border rounded-md text-sm bg-background/80 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap">To page:</label>
                  <input
                    type="number"
                    value={endPage}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setEndPage('');
                        return;
                      }
                      const num = parseInt(value);
                      if (num >= 1 && num <= totalPages) {
                        setEndPage(value);
                        setError(null);
                        // Adjust start page if it's greater than end page
                        const startNum = parseInt(startPage);
                        if (startNum > num) {
                          setStartPage(value);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (endPage === '') {
                        setEndPage(String(totalPages));
                      }
                    }}
                    min={1}
                    max={totalPages}
                    className="w-24 px-4 py-2 border rounded-md text-sm bg-background/80 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-center sm:text-left mt-2 sm:mt-0">
                Total pages: {totalPages}
              </div>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={mode === 'merge' ? handleMerge : handleSplit}
            disabled={processing || (mode === 'merge' ? files.length < 2 : files.length !== 1)}
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
                <span className="text-sm sm:text-base">{mode === 'merge' ? 'Merging PDFs...' : 'Splitting PDF...'}</span>
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">{mode === 'merge' ? 'Merge PDF Files' : 'Split PDF File'}</span>
              </>
            )}
          </button>
        </>
      )}

      {/* Success Message with Download and Reset */}
      {success && (mode === 'merge' ? mergedPdfUrl : splitPdfUrls.length > 0) && (
        <div className="flex flex-col space-y-3 sm:space-y-4 p-4 sm:p-6 bg-background rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2 text-foreground">
            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <p className="text-sm sm:text-base font-medium">
              {mode === 'merge' ? 'PDF files merged successfully!' : 'PDF split successfully into individual pages!'}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            {mode === 'merge' ? (
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
            ) : (
              <button
                onClick={() => handleDownloadSplit(splitPdfUrls[0])}
                className={cn(
                  'flex items-center justify-center space-x-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  'transition-all duration-200 ease-in-out transform hover:scale-[0.98]',
                  'text-sm sm:text-base w-full'
                )}
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>Download Selected Pages</span>
              </button>
            )}
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
              <span>Start New {mode === 'merge' ? 'Merge' : 'Split'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFMerger;