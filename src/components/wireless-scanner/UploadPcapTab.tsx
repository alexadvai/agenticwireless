'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { WirelessScan } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


const mockUploads: WirelessScan[] = [
    { id: 'scan-1', mode: 'upload', status: 'completed', userId: 'user-123', createdAt: new Date(Date.now() - 86400000), fileName: 'capture_01.pcapng' },
    { id: 'scan-2', mode: 'upload', status: 'running', userId: 'user-123', createdAt: new Date(Date.now() - 3600000), fileName: 'office-network.pcap' },
    { id: 'scan-3', mode: 'upload', status: 'queued', userId: 'user-123', createdAt: new Date(), fileName: 'guest-wifi-traffic.pcap' },
];

export function UploadPcapTab() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previousUploads, setPreviousUploads] = useState<WirelessScan[]>(mockUploads);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const canUpload = user?.roles.some(role => ['admin', 'analyst', 'wireless-hunter'].includes(role));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.name.endsWith('.pcap') || selectedFile.name.endsWith('.pcapng')) {
        setFile(selectedFile);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a .pcap or .pcapng file.',
        });
      }
    }
  };

  const handleUpload = () => {
    if (!canUpload) {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'You do not have the required role to upload files.',
      });
      return;
    }
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a file to upload.',
      });
      return;
    }
    
    setUploadProgress(0);
    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev === null) {
                clearInterval(interval);
                return null;
            }
            if (prev >= 100) {
                clearInterval(interval);
                toast({
                    title: 'Upload Complete',
                    description: `${file.name} has been uploaded and is queued for analysis.`,
                });
                const newScan: WirelessScan = {
                    id: `scan-${Date.now()}`,
                    mode: 'upload',
                    status: 'queued',
                    userId: user.id,
                    createdAt: new Date(),
                    fileName: file.name
                };
                setPreviousUploads(prev => [newScan, ...prev]);
                setFile(null);
                if(fileInputRef.current) fileInputRef.current.value = "";
                return null;
            }
            return prev + 10;
        })
    }, 200);

  };

  const getStatusBadge = (status: WirelessScan['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-500 text-white"><Clock className="mr-1 h-3 w-3" />Running</Badge>;
      case 'queued':
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Queued</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" />Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload PCAP File</CardTitle>
          <CardDescription>Upload a .pcap or .pcapng file for asynchronous analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="file"
              ref={fileInputRef}
              accept=".pcap,.pcapng"
              onChange={handleFileChange}
              disabled={!canUpload || uploadProgress !== null}
              className="flex-grow"
            />
            <Button onClick={handleUpload} disabled={!canUpload || !file || uploadProgress !== null}>
              <Upload className="mr-2" /> Upload and Analyze
            </Button>
          </div>
          {uploadProgress !== null && (
            <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">Uploading {file?.name}... {uploadProgress}%</p>
            </div>
          )}
          {!canUpload && (
            <div className="flex items-center text-sm text-destructive p-3 bg-destructive/10 rounded-md">
              <AlertCircle className="mr-2 h-4 w-4" />
              Your current role does not permit uploading PCAP files.
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Previous Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previousUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">{upload.fileName}</TableCell>
                  <TableCell>{upload.createdAt.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(upload.status)}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" disabled={upload.status !== 'completed'}>View Results</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
