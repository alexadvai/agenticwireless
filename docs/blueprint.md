# **App Name**: Wireless Insights

## Core Features:

- Sidebar Integration: Displays a main sidebar item with the text 'Wireless Scanner', that routes to '/wireless-scanner'.
- Tabbed Interface: Implements five tabs: 'Live Capture', 'Upload PCAP', 'Traffic Explorer', 'Protocol Analysis', and 'Anomaly Detection'.
- Live Capture Controls: Allows users to select a 'Capture Agent' from a dropdown and initiate a scan with a 'Start Scan' button.
- Real-time Scan Display: Shows a live log console and a real-time chart displaying packets per second during live scans.
- PCAP Upload: Enables users to upload .pcap files for analysis.
- Traffic Explorer Table: Displays a table of packets with columns for timestamp, protocol, source, destination, and summary; includes filtering by time range and protocol type.
- AI-Powered Protocol Analysis: Presents traffic summaries by protocol with total packets, data volume, and anomaly counts; employs an AI tool to generate summaries, displayed in collapsible cards.

## Style Guidelines:

- Primary color: Saturated blue (#4285F4) for a trustworthy and technical feel.
- Background color: Dark gray (#282A3A) to align with AdversAI's dark UI theme, with text designed for legibility against a dark backdrop.
- Accent color: Analogous cyan (#33CBCB) for highlights, progress indicators, and interactive elements, contrasting well against the primary and background.
- Body and headline font: 'Inter' (sans-serif) for a clean, modern, and easily readable interface.
- Use sharp, clear icons to represent different protocols and security concepts.
- Maintain a consistent layout throughout the app, reusing existing AdversAI components where possible to preserve the feel of their user interface.
- Incorporate subtle animations, like progress bars, to communicate scanning status.