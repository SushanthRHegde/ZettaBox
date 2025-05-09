import React, { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Camera, Download, Upload, Link as LinkIcon, Mail, Phone, Copy, QrCode } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const QRCode = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('generate');
  const [qrContent, setQrContent] = useState('');
  const [qrType, setQrType] = useState<'text' | 'url' | 'email' | 'phone'>('text');
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState('');

  const generateQRContent = () => {
    switch (qrType) {
      case 'url':
        return qrContent.startsWith('http') ? qrContent : `https://${qrContent}`;
      case 'email':
        return `mailto:${qrContent}`;
      case 'phone':
        return `tel:${qrContent}`;
      default:
        return qrContent;
    }
  };

  const downloadQRCode = useCallback(async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(qrRef.current);
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = dataUrl;
        link.click();
        toast({
          title: 'QR Code downloaded',
          description: 'The QR code has been downloaded successfully.',
        });
      } catch (err) {
        toast({
          title: 'Download failed',
          description: 'Failed to download the QR code.',
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scannedResult);
      toast({
        title: 'Copied!',
        description: 'The scanned content has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy the content to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const startScanning = async () => {
    const codeReader = new BrowserQRCodeReader();
    setIsScanning(true);
    setScannedResult('');

    try {
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0].deviceId;

      if (videoRef.current) {
        const controls = await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result) => {
            if (result) {
              setScannedResult(result.getText());
              controls.stop();
              setIsScanning(false);
            }
          }
        );
      }
    } catch (err) {
      console.error('Failed to start scanning:', err);
      toast({
        title: 'Scanning failed',
        description: 'Failed to access the camera or start scanning.',
        variant: 'destructive',
      });
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const codeReader = new BrowserQRCodeReader();
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL();
        const imgElement = new Image();
        imgElement.src = dataUrl;
        await new Promise((resolve) => (imgElement.onload = resolve));
        const result = await codeReader.decodeFromImageElement(imgElement);
        if (result) {
          setScannedResult(result.getText());
        }
      }
    } catch (err) {
      toast({
        title: 'Scanning failed',
        description: 'Failed to scan the uploaded image.',
        variant: 'destructive',
      });
    }
  };

  const typeIcons = {
    text: null,
    url: <LinkIcon className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto">
        <header className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">QR Code Tools</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Generate and scan QR codes for various purposes
          </p>
        </header>

        {/* Main Tools Section */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              QR Code Generator & Scanner
            </h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>QR Code Tools</CardTitle>
              <CardDescription>Generate or scan QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="generate">Generate</TabsTrigger>
                  <TabsTrigger value="scan">Scan</TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Content Type</Label>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                          value="text"
                          onClick={() => setQrType('text')}
                          className={qrType === 'text' ? 'bg-primary text-primary-foreground' : ''}
                        >
                          Text
                        </TabsTrigger>
                        <TabsTrigger
                          value="url"
                          onClick={() => setQrType('url')}
                          className={qrType === 'url' ? 'bg-primary text-primary-foreground' : ''}
                        >
                          URL
                        </TabsTrigger>
                        <TabsTrigger
                          value="email"
                          onClick={() => setQrType('email')}
                          className={qrType === 'email' ? 'bg-primary text-primary-foreground' : ''}
                        >
                          Email
                        </TabsTrigger>
                        <TabsTrigger
                          value="phone"
                          onClick={() => setQrType('phone')}
                          className={qrType === 'phone' ? 'bg-primary text-primary-foreground' : ''}
                        >
                          Phone
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="grid gap-2">
                      <Label>Content</Label>
                      <div className="flex gap-2">
                        {typeIcons[qrType] && (
                          <div className="flex items-center justify-center w-10 h-10 border rounded-md">
                            {typeIcons[qrType]}
                          </div>
                        )}
                        <Input
                          value={qrContent}
                          onChange={(e) => setQrContent(e.target.value)}
                          placeholder={`Enter ${qrType}...`}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {qrContent && (
                      <div className="flex flex-col items-center gap-4 pt-4">
                        <div ref={qrRef} className="p-4 bg-white rounded-lg">
                          <QRCodeCanvas
                            value={generateQRContent()}
                            size={200}
                            level="H"
                            includeMargin
                          />
                        </div>
                        <Button onClick={downloadQRCode}>
                          <Download className="h-4 w-4 mr-2" />
                          Download QR Code
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="scan" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-4">
                      <div className="flex justify-center gap-4">
                        <Button onClick={startScanning} disabled={isScanning}>
                          <Camera className="h-4 w-4 mr-2" />
                          {isScanning ? 'Scanning...' : 'Start Camera'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      {isScanning && (
                        <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
                          <video ref={videoRef} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {scannedResult && (
                        <div className="space-y-2">
                          <Label>Scanned Content</Label>
                          <div className="flex gap-2">
                            <Input value={scannedResult} readOnly />
                            <Button variant="outline" size="icon" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default QRCode; 