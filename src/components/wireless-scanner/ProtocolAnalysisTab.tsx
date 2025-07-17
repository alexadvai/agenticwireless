'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ProtocolSummary, Protocol } from '@/lib/types';
import { Button } from '../ui/button';
import { summarizeProtocolBehavior } from '@/ai/flows/summarize-protocol-behavior';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialSummaries: ProtocolSummary[] = [
  { protocol: '802.11', packetCount: 12543, dataVolume: 1578654, anomalyCount: 12 },
  { protocol: 'DHCP', packetCount: 234, dataVolume: 74880, anomalyCount: 5 },
  { protocol: 'HTTP', packetCount: 8765, dataVolume: 12345678, anomalyCount: 2 },
  { protocol: 'DNS', packetCount: 4321, dataVolume: 345680, anomalyCount: 0 },
];

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function ProtocolAnalysisTab() {
  const [summaries, setSummaries] = useState<ProtocolSummary[]>(initialSummaries);
  const { toast } = useToast();

  const handleGenerateSummary = async (protocol: Protocol) => {
    setSummaries(s => s.map(p => p.protocol === protocol ? { ...p, isLoadingAiSummary: true } : p));
    try {
      // In a real app, packetSummary would be derived from actual scan data.
      const mockPacketSummary = `Packets for ${protocol} show frequent handshakes and data transfers. Some retransmissions observed.`;
      
      const result = await summarizeProtocolBehavior({
        protocol,
        packetSummary: mockPacketSummary,
      });

      setSummaries(s => s.map(p => p.protocol === protocol ? { ...p, aiSummary: result.summary, isLoadingAiSummary: false } : p));
      toast({ title: 'AI Summary Generated', description: `Summary for ${protocol} has been successfully generated.` });
    } catch (error) {
      console.error('AI summary generation failed:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate AI summary.' });
      setSummaries(s => s.map(p => p.protocol === protocol ? { ...p, isLoadingAiSummary: false } : p));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol Analysis</CardTitle>
        <CardDescription>Aggregated traffic statistics and AI-powered behavior summaries for each protocol detected.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {summaries.map((summary) => (
            <AccordionItem value={summary.protocol} key={summary.protocol}>
              <AccordionTrigger className='text-lg font-medium'>
                {summary.protocol}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-muted-foreground">Total Packets</p>
                    <p className="font-semibold text-lg">{summary.packetCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-muted-foreground">Data Volume</p>
                    <p className="font-semibold text-lg">{formatBytes(summary.dataVolume)}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-muted-foreground">Anomalies</p>
                    <p className="font-semibold text-lg">{summary.anomalyCount}</p>
                  </div>
                </div>
                <Card className="bg-background/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            AI-Generated Behavior Summary
                            <Button size="sm" onClick={() => handleGenerateSummary(summary.protocol as Protocol)} disabled={summary.isLoadingAiSummary}>
                                {summary.isLoadingAiSummary ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                {summary.aiSummary ? 'Regenerate' : 'Generate'}
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {summary.isLoadingAiSummary && <p className="text-muted-foreground">Generating summary...</p>}
                        {summary.aiSummary ? (
                           <p className="text-muted-foreground">{summary.aiSummary}</p>
                        ) : (
                           !summary.isLoadingAiSummary && <p className="text-muted-foreground">Click 'Generate' to create an AI summary for this protocol.</p>
                        )}
                    </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
