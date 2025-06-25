import React, { useState } from 'react';
import { Upload, FileUp, Check, AlertCircle, Trash2, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';

type CompressionQuality = 'extreme' | 'normal' | 'low';

const PDFCompress: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState<CompressionQuality>('normal');
  const [error, setError] = useState<string | null>(null);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      if (compressedPdfUrl) {
        URL.revokeObjectURL(compressedPdfUrl);
        setCompressedPdfUrl(null);
      }
    }
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    if (compressedPdfUrl) {
      URL.revokeObjectURL(compressedPdfUrl);
      setCompressedPdfUrl(null);
    }
  };

  // Handle compression
  const handleCompress = async () => {
    if (!file) {
      setError('Please upload a PDF file');
      return;
    }

    setCompressing(true);
    setError(null);

    try {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);

      // Compression settings based on quality
      const compressionSettings = {
        extreme: { imageQuality: 0.1, imageScale: 0.5 },
        normal: { imageQuality: 0.4, imageScale: 0.8 },
        low: { imageQuality: 0.7, imageScale: 0.9 }
      }[quality];

      // Compress PDF
      const compressedPdf = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        ...compressionSettings
      });

      // Create and save the compressed PDF
      const blob = new Blob([compressedPdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCompressedPdfUrl(url);

      toast({
        title: 'PDF Compressed Successfully',
        description: 'Your PDF has been compressed and is ready for download.',
        duration: 3000
      });
    } catch (err) {
      setError('Error compressing PDF file');
      toast({
        title: 'Compression Failed',
        description: 'There was an error compressing your PDF file.',
        variant: 'destructive'
      });
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">PDF Compressor</h1>
        <p className="text-muted-foreground">Reduce PDF file size while maintaining quality</p>
      </header>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-6">
        {/* File upload area */}
        <div>
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center",
              file ? "border-primary/30 bg-primary/5" : "border-border"
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label 
              htmlFor="file-upload" 
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium mb-1">Drop PDF here or click to upload</p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 100MB
              </p>
            </label>
          </div>
        </div>

        {/* File info and compression options */}
        {file && (
          <div className="space-y-4">
            {/* Selected file */}
            <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
              <div className="flex items-center">
                <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button 
                onClick={handleRemoveFile}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Compression quality options */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Compression Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {(['extreme', 'normal', 'low'] as CompressionQuality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      quality === q
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Compress button */}
            <button
              onClick={handleCompress}
              disabled={compressing}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {compressing ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Compressing...
                </span>
              ) : (
                'Compress PDF'
              )}
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Download button */}
        {compressedPdfUrl && (
          <div className="flex justify-center">
            <a
              href={compressedPdfUrl}
              download={`compressed_${file?.name}`}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Compressed PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFCompress;