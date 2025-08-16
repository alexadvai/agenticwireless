'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Packet, Protocol } from '@/lib/types';
import { Button } from '../ui/button';
import { format } from 'date-fns';

const protocols: Protocol[] = ['802.11', 'ARP', 'DHCP', 'HTTP', 'DNS', 'TCP', 'UDP'];

const mockPackets: Packet[] = Array.from({ length: 150 }, (_, i) => ({
  id: `pkt-${i}`,
  timestamp: new Date(Date.now() - Math.random() * 1000 * 3600 * 24),
  protocol: protocols[i % protocols.length],
  source: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
  destination: `10.0.0.${Math.floor(Math.random() * 254) + 1}`,
  summary: `Packet summary for packet number ${i}`,
}));

const ITEMS_PER_PAGE = 10;

export function TrafficExplorerTab() {
  const [filterProtocol, setFilterProtocol] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPackets = useMemo(() => {
    return mockPackets
      .filter(p => filterProtocol === 'all' || p.protocol === filterProtocol)
      .filter(p =>
        p.source.includes(searchTerm) ||
        p.destination.includes(searchTerm) ||
        p.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [filterProtocol, searchTerm]);

  const totalPages = Math.ceil(filteredPackets.length / ITEMS_PER_PAGE);

  const paginatedPackets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPackets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPackets, currentPage]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Explorer</CardTitle>
        <CardDescription>Inspect individual packets from your scans. Use filters to narrow down the results.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search source, destination, summary..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow"
          />
          <Select value={filterProtocol} onValueChange={(v) => {setFilterProtocol(v); setCurrentPage(1);}}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Protocols</SelectItem>
              {protocols.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPackets.length > 0 ? (
                paginatedPackets.map(packet => (
                  <TableRow key={packet.id}>
                    <TableCell className="whitespace-nowrap">{format(packet.timestamp, "MMM d, h:mm a")}</TableCell>
                    <TableCell>{packet.protocol}</TableCell>
                    <TableCell>{packet.source}</TableCell>
                    <TableCell>{packet.destination}</TableCell>
                    <TableCell className="max-w-xs truncate">{packet.summary}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">No packets found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {totalPages > 0 ? currentPage : 0} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
