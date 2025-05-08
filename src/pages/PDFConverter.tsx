
import React, { useState } from 'react';
import { Upload, FileUp, FileDown, Check, AlertCircle, Trash2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { cn } from '@/lib/utils';

const PDFConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError(null);
      setSuccess(false);
    }
  };

  // Handle file removal
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle conversion
  const handleConvert = () => {
    if (files.length === 0) {
      setError("Please upload at least one file");
      return;
    }

    setConverting(true);
    setError(null);
    
    // Simulate conversion process
    setTimeout(() => {
      setConverting(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">PDF Converter</h1>
          <p className="text-muted-foreground">Convert files to and from PDF format</p>
        </header>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          {/* File upload area */}
          <div className="mb-6">
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center",
                files.length > 0 ? "border-primary/30 bg-primary/5" : "border-border"
              )}
            >
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground">
                  Supports DOCX, XLSX, PPTX, JPG, PNG, and more
                </p>
              </label>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Selected Files</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-secondary rounded-md"
                  >
                    <div className="flex items-center">
                      <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conversion options */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Convert To</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['pdf', 'docx', 'xlsx', 'pptx'].map(format => (
                <button
                  key={format}
                  className={cn(
                    "px-4 py-2 border rounded-md text-sm transition-colors",
                    outputFormat === format 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "border-border hover:bg-secondary"
                  )}
                  onClick={() => setOutputFormat(format)}
                >
                  .{format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-md flex items-center text-sm text-primary">
              <Check className="h-4 w-4 mr-2" />
              Files converted successfully! Download will start automatically.
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || converting}
              className={cn(
                "flex items-center px-4 py-2 rounded-md font-medium",
                files.length === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {converting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Converting...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Convert Files
                </>
              )}
            </button>
          </div>
        </div>

        {/* Usage limit notice for guest */}
        <div className="mt-6 p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Guest Mode Limit</p>
              <p className="text-xs text-muted-foreground">2 of 3 free conversions used</p>
            </div>
            <div className="w-1/3 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="bg-primary h-full w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PDFConverter;
