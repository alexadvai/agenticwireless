'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveCaptureTab } from './LiveCaptureTab';
import { UploadPcapTab } from './UploadPcapTab';
import { TrafficExplorerTab } from './TrafficExplorerTab';
import { ProtocolAnalysisTab } from './ProtocolAnalysisTab';
import { AnomalyDetectionTab } from './AnomalyDetectionTab';
import { Wifi, Upload, Search, BarChart, ShieldAlert } from 'lucide-react';

export function WirelessScannerTabs() {
  return (
    <Tabs defaultValue="live-capture" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 h-auto">
        <TabsTrigger value="live-capture" className="py-2"><Wifi className="mr-2" />Live Capture</TabsTrigger>
        <TabsTrigger value="upload-pcap" className="py-2"><Upload className="mr-2" />Upload PCAP</TabsTrigger>
        <TabsTrigger value="traffic-explorer" className="py-2"><Search className="mr-2" />Traffic Explorer</TabsTrigger>
        <TabsTrigger value="protocol-analysis" className="py-2"><BarChart className="mr-2" />Protocol Analysis</TabsTrigger>
        <TabsTrigger value="anomaly-detection" className="py-2"><ShieldAlert className="mr-2" />Anomaly Detection</TabsTrigger>
      </TabsList>
      <TabsContent value="live-capture" className="mt-6">
        <LiveCaptureTab />
      </TabsContent>
      <TabsContent value="upload-pcap" className="mt-6">
        <UploadPcapTab />
      </TabsContent>
      <TabsContent value="traffic-explorer" className="mt-6">
        <TrafficExplorerTab />
      </TabsContent>
      <TabsContent value="protocol-analysis" className="mt-6">
        <ProtocolAnalysisTab />
      </TabsContent>
      <TabsContent value="anomaly-detection" className="mt-6">
        <AnomalyDetectionTab />
      </TabsContent>
    </Tabs>
  );
}
