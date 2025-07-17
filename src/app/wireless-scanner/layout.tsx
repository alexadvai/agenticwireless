import { AppLayout } from '@/components/layout/AppLayout';

export default function WirelessScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
