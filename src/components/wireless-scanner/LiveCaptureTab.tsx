'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export function LiveCaptureTab() {
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [packetsData, setPacketsData] = useState<{ name: string; packets: number }[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const canStartScan = user?.roles.some(role => ['admin', 'analyst', 'wireless-hunter'].includes(role));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        const newLog = `[${new Date().toLocaleTimeString()}] Packet captured: Protocol ${['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)]}, Length ${Math.floor(Math.random() * 1500)}`;
        setLogs(prev => [...prev.slice(-200), newLog]);
        
        setPacketsData(prev => {
            const now = new Date();
            const timeKey = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            const newDataPoint = { name: timeKey, packets: Math.floor(Math.random() * 100) + 50 };
            return [...prev.slice(-9), newDataPoint];
        });

      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleScanToggle = () => {
    if (!canStartScan) {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "You do not have the required role to start a scan.",
      });
      return;
    }

    if (isScanning) {
      setIsScanning(false);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Scan stopped by user.`]);
      toast({ title: "Scan Stopped", description: "Live capture has been stopped." });
    } else {
      setIsScanning(true);
      setLogs([`[${new Date().toLocaleTimeString()}] Starting live capture...`]);
      setPacketsData([]);
      toast({ title: "Scan Started", description: "Live capture is now running." });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Packet Capture</CardTitle>
        <CardDescription>Capture wireless network traffic in real-time from a selected agent.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="wlan0" disabled={isScanning}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Capture Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wlan0">wlan0</SelectItem>
              <SelectItem value="wlan1">wlan1</SelectItem>
              <SelectItem value="mon0">mon0</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleScanToggle} disabled={!canStartScan} className="w-full sm:w-auto">
            {isScanning ? <><Square className="mr-2" />Stop Scan</> : <><Play className="mr-2" />Start Scan</>}
          </Button>
        </div>

        {!canStartScan && (
          <div className="flex items-center text-sm text-destructive p-3 bg-destructive/10 rounded-md">
            <AlertCircle className="mr-2 h-4 w-4" />
            Your current role does not permit starting live scans.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Packets per Second</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={packetsData}>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                            <Bar dataKey="packets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Live Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={logContainerRef} className="h-[250px] bg-muted/50 rounded-md p-4 overflow-y-auto font-mono text-xs">
                        {logs.length > 0 ? logs.map((log, i) => <p key={i}>{log}</p>) : <p>Scan not running. Start a scan to see live logs.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
