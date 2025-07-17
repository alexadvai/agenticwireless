// Analyzes a network security anomaly and provides expert insights and recommendations.

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Anomaly } from '@/lib/types';

const AnalyzeAnomalyInputSchema = z.object({
  type: z.string().describe('The type of the anomaly (e.g., "DHCP Flood", "Rogue AP").'),
  severity: z.string().describe('The severity of the anomaly (e.g., "High", "Critical").'),
  description: z.string().describe('A brief description of the detected anomaly.'),
  packetSample: z.string().describe('A small sample of raw packet data associated with the anomaly.'),
});
export type AnalyzeAnomalyInput = z.infer<typeof AnalyzeAnomalyInputSchema>;

const AnalyzeAnomalyOutputSchema = z.object({
  analysis: z.string().describe("A detailed analysis of what the anomaly is and what it means. Explain the potential risks and impact in a concise paragraph."),
  recommendation: z.string().describe("A concrete, actionable recommendation for a network administrator to mitigate the threat. Provide specific steps if possible."),
});
export type AnalyzeAnomalyOutput = z.infer<typeof AnalyzeAnomalyOutputSchema>;

export async function analyzeAnomaly(input: AnalyzeAnomalyInput): Promise<AnalyzeAnomalyOutput> {
  return analyzeAnomalyFlow(input);
}

const analyzeAnomalyPrompt = ai.definePrompt({
  name: 'analyzeAnomalyPrompt',
  input: { schema: AnalyzeAnomalyInputSchema },
  output: { schema: AnalyzeAnomalyOutputSchema },
  prompt: `You are an expert network security analyst providing insights for the AgenticWireless tool. Your task is to analyze a detected security anomaly and provide a clear, concise analysis and an actionable recommendation.

**Anomaly Details:**
- **Type:** {{{type}}}
- **Severity:** {{{severity}}}
- **Description:** {{{description}}}

**Raw Packet Sample:**
\`\`\`
{{{packetSample}}}
\`\`\`

Based on the information above, provide your expert assessment.`,
});

const analyzeAnomalyFlow = ai.defineFlow(
  {
    name: 'analyzeAnomalyFlow',
    inputSchema: AnalyzeAnomalyInputSchema,
    outputSchema: AnalyzeAnomalyOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeAnomalyPrompt(input);
    return output!;
  }
);
