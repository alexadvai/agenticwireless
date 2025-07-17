export interface WirelessScan {
  id: string;
  mode: 'live' | 'upload';
  interface?: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  userId: string;
  createdAt: Date;
  fileName?: string;
  fileUrl?: string;
  resultsLink?: string;
}

export type Protocol = '802.11' | 'ARP' | 'DHCP' | 'HTTP' | 'DNS' | 'TCP' | 'UDP';

export interface Packet {
  id: string;
  timestamp: Date;
  protocol: Protocol;
  source: string;
  destination: string;
  summary: string;
}

export interface Anomaly {
  id: string;
  type: 'DHCP Flood' | 'Spoofed MAC' | 'Beacon Flood' | 'Rogue AP';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: Date;
  description: string;
}

export interface ProtocolSummary {
  protocol: Protocol;
  packetCount: number;
  dataVolume: number; // in bytes
  anomalyCount: number;
  aiSummary?: string;
  isLoadingAiSummary?: boolean;
}

export interface AnomalyAnalysis {
  analysis: string;
  recommendation: string;
}
