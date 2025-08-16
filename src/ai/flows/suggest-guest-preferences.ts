
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting guest preferences based on their history.
 *
 * It includes:
 * - `suggestGuestPreferences`: An async function that takes guest history as input and returns preference suggestions.
 * - `SuggestGuestPreferencesInput`: The input type for the suggestGuestPreferences function.
 * - `SuggestGuestPreferencesOutput`: The output type for the suggestGuestPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuestStatusSchema = z.enum(['Checked-in', 'Arriving Soon', 'Checked-out', 'Prospect']);

const SuggestGuestPreferencesInputSchema = z.object({
  guestHistory: z.string().describe('A detailed history of the guest, including past stays, preferences, and any available feedback.'),
  guestStatus: GuestStatusSchema.describe("The guest's current status, which dictates the type of suggestions needed."),
});
export type SuggestGuestPreferencesInput = z.infer<typeof SuggestGuestPreferencesInputSchema>;

const SuggestGuestPreferencesOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A list of suggested preferences or perks tailored to the guest.')
  ).describe('AI-generated suggestions for guest preferences based on their history.'),
  reasoning: z.string().describe('The AI model reasoning behind the suggested preferences.'),
});
export type SuggestGuestPreferencesOutput = z.infer<typeof SuggestGuestPreferencesOutputSchema>;

export async function suggestGuestPreferences(input: SuggestGuestPreferencesInput): Promise<SuggestGuestPreferencesOutput> {
  return suggestGuestPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGuestPreferencesPrompt',
  input: {schema: SuggestGuestPreferencesInputSchema},
  output: {schema: SuggestGuestPreferencesOutputSchema},
  prompt: `You are an AI assistant for a luxury hotel group. Your task is to analyze guest data and provide actionable suggestions based on their current status.

Analyze the following guest history:
{{{guestHistory}}}

The guest's current status is: {{{guestStatus}}}.

Your suggestions MUST be relevant to their status:

- If the status is 'Prospect', provide marketing and acquisition ideas to encourage their first booking. Suggestions could include targeted offers, content ideas, or outreach strategies.
- If the status is 'Arriving Soon' or 'Checked-in', provide personalized in-stay suggestions to enhance their current or upcoming visit. These could be perks, services, or special arrangements.
- If the status is 'Checked-out', provide post-stay follow-up suggestions to build loyalty and encourage a return visit. This could include personalized thank-you messages, special offers for future stays, or thoughtful gifts.

IMPORTANT: A "New Guest" with "Total Stays: 1" is a first-time guest. Do NOT suggest "welcome back" amenities for them if they are 'Arriving Soon' or 'Checked-in'. Suggest "welcome" amenities instead. A "Returning Guest" has stayed before.

Provide a list of specific, personalized suggestions and explain your reasoning. Format your response as a JSON object with 'suggestions' and 'reasoning'. If there are no obvious suggestions, the 'suggestions' array can be empty, but you must still provide reasoning.
  `,
});

const suggestGuestPreferencesFlow = ai.defineFlow(
  {
    name: 'suggestGuestPreferencesFlow',
    inputSchema: SuggestGuestPreferencesInputSchema,
    outputSchema: SuggestGuestPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
