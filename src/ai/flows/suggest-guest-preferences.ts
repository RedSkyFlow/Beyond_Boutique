
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

const SuggestGuestPreferencesInputSchema = z.object({
  guestHistory: z.string().describe('A detailed history of the guest, including past stays, preferences, and any available feedback.'),
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
  prompt: `You are an AI assistant for a luxury hotel group that analyzes guest history and suggests potential preferences or perks to enhance their stay.
  
  IMPORTANT: A "New Guest" with "Total Stays: 1" is a first-time guest currently on their first stay. Do NOT suggest "welcome back" amenities for them. Suggest "welcome" amenities instead. A "Returning Guest" has stayed before.

  Analyze the following guest history:
  {{{guestHistory}}}

  Based on this history, provide a list of specific and personalized suggestions that would improve their experience.
  Explain your reasoning for each suggestion.

  Format your response as a JSON object with 'suggestions' (an array of strings) and 'reasoning' (a string explaining the suggestions). If there are no obvious suggestions based on the guest history, the 'suggestions' array can be empty, but you should still fill the reasoning.
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
