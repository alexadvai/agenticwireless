'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Anomaly, AnomalyAnalysis } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeAnomaly } from '@/ai/flows/analyze-anomaly';
import { Skeleton } from '../ui/skeleton';

const mockAnomalies: Anomaly[] = [
  { id: 'anom-1', type: 'DHCP Flood', severity: 'High', timestamp: new Date(Date.now() - 3600000), description: 'Excessive DHCP requests from MAC 00:1B:44:11:3A:B7' },
  { id: 'anom-2', type: 'Spoofed MAC', severity: 'Medium', timestamp: new Date(Date.now() - 7200000), description: 'MAC address 0A:1B:4C:11:3A:B7 seen on multiple IPs' },
  { id: 'anom-3', type: 'Beacon Flood', severity: 'High', timestamp: new Date(Date.now() - 86400000), description: 'High volume of 802.11 beacon frames detected' },
  { id: 'anom-4', type: 'Rogue AP', severity: 'Critical', timestamp: new Date(Date.now() - 172800000), description: 'Unauthorized AP "Free-Wifi-No-Virus" detected' },
];

const mockPacketData = `-- Sample Packet Data --
Frame 1: 42 bytes on wire (336 bits), 42 bytes captured (336 bits)
Ethernet II, Src: PcsCompu_3a:b7:c8 (00:1b:44:11:3a:b7), Dst: Broadcast (ff:ff:ff:ff:ff:ff)
Address Resolution Protocol (request)
    Hardware type: Ethernet (1)
    Protocol type: IPv4 (0x0800)
    Hardware size: 6
    Protocol size: 4
    Opcode: request (1)
    Sender MAC address: PcsCompu_3a:b7:c8 (00:1b:44:11:3a:b7)
    Sender IP address: 192.168.1.101
    Target MAC address: 00:00:00:00:00:00 (00:00:00:00:00:00)
    Target IP address: 192.168.1.1`;

export function AnomalyDetectionTab() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnomalyAnalysis | null>(null);
  const { toast } = useToast();

  const getSeverityBadge = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'Critical': return <Badge variant="destructive" className="bg-red-700 text-white">{severity}</Badge>;
      case 'High': return <Badge variant="destructive">{severity}</Badge>;
      case 'Medium': return <Badge variant="secondary" className="bg-yellow-500 text-black">{severity}</Badge>;
      case 'Low': return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const handleIncidentReview = async (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    setIsDialogOpen(true);
    setIsLoadingAnalysis(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeAnomaly({
        type: anomaly.type,
        severity: anomaly.severity,
        description: anomaly.description,
        packetSample: mockPacketData,
      });
      setAnalysisResult(result);
      toast({ title: "Analysis Complete", description: "AI-powered insights have been generated." });
    } catch (error) {
      console.error("Failed to analyze anomaly:", error);
      toast({ variant: "destructive", title: "Analysis Failed", description: "Could not generate AI insights for this anomaly." });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Detection</CardTitle>
        <CardDescription>Review potential security threats and anomalous behavior identified during scans.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAnomalies.map(anomaly => (
                  <TableRow key={anomaly.id}>
                    <TableCell className="font-medium flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-destructive"/>{anomaly.type}</TableCell>
                    <TableCell>{getSeverityBadge(anomaly.severity)}</TableCell>
                    <TableCell>{anomaly.timestamp.toLocaleString()}</TableCell>
                    <TableCell className="max-w-sm truncate">{anomaly.description}</TableCell>
                    <TableCell>
                      <Button variant="default" size="sm" onClick={() => handleIncidentReview(anomaly)}>
                        <Wand2 className="mr-2 h-4 w-4"/>
                        Review with AI
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Incident Review: {selectedAnomaly?.type}</DialogTitle>
              <DialogDescription>
                Detailed information and AI-generated analysis for the selected security anomaly.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="text-sm space-y-2">
                    <div><strong className="text-foreground mr-2">Severity:</strong> {getSeverityBadge(selectedAnomaly?.severity || 'Low')}</div>
                    <div><strong className="text-foreground">Timestamp:</strong> {selectedAnomaly?.timestamp.toLocaleString()}</div>
                    <div><strong className="text-foreground">Description:</strong> {selectedAnomaly?.description}</div>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">AI-Powered Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingAnalysis ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-1/4 mt-2" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ) : analysisResult ? (
                            <>
                                <div>
                                    <h4 className="font-semibold mb-1 text-foreground">Analysis</h4>
                                    <p className="text-sm text-muted-foreground">{analysisResult.analysis}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1 text-foreground">Recommendation</h4>
                                    <p className="text-sm text-muted-foreground">{analysisResult.recommendation}</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Could not load AI analysis.</p>
                        )}
                    </CardContent>
                </Card>

                <div>
                    <h4 className="font-semibold mb-2 text-foreground">Raw Packet Traces</h4>
                    <pre className="text-xs p-4 bg-muted/50 rounded-md overflow-x-auto h-48">
                        {mockPacketData}
                    </pre>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
