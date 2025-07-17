// Summarizes the behavior of a given network protocol using AI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProtocolBehaviorInputSchema = z.object({
  protocol: z.string().describe('The name of the protocol to summarize (e.g., 802.11, DHCP, HTTP).'),
  packetSummary: z.string().describe('A summary of the network packets for the specified protocol.'),
});
export type SummarizeProtocolBehaviorInput = z.infer<typeof SummarizeProtocolBehaviorInputSchema>;

const SummarizeProtocolBehaviorOutputSchema = z.object({
  summary: z.string().describe('An AI-generated summary of the protocol behavior.'),
});
export type SummarizeProtocolBehaviorOutput = z.infer<typeof SummarizeProtocolBehaviorOutputSchema>;

export async function summarizeProtocolBehavior(input: SummarizeProtocolBehaviorInput): Promise<SummarizeProtocolBehaviorOutput> {
  return summarizeProtocolBehaviorFlow(input);
}

const summarizeProtocolBehaviorPrompt = ai.definePrompt({
  name: 'summarizeProtocolBehaviorPrompt',
  input: {schema: SummarizeProtocolBehaviorInputSchema},
  output: {schema: SummarizeProtocolBehaviorOutputSchema},
  prompt: `You are an expert network analyst. Summarize the behavior of the following network protocol based on the packet summary provided.\n\nProtocol: {{{protocol}}}\nPacket Summary: {{{packetSummary}}}\n\nSummary:`,
});

const summarizeProtocolBehaviorFlow = ai.defineFlow(
  {
    name: 'summarizeProtocolBehaviorFlow',
    inputSchema: SummarizeProtocolBehaviorInputSchema,
    outputSchema: SummarizeProtocolBehaviorOutputSchema,
  },
  async input => {
    const {output} = await summarizeProtocolBehaviorPrompt(input);
    return output!;
  }
);
