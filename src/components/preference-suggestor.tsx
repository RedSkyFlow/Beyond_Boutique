'use client';

import { useState } from 'react';
import type { Guest } from '@/types';
import { suggestGuestPreferences, type SuggestGuestPreferencesOutput } from '@/ai/flows/suggest-guest-preferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PreferenceSuggestorProps {
  guest: Guest;
}

export function PreferenceSuggestor({ guest }: PreferenceSuggestorProps) {
  const [suggestions, setSuggestions] = useState<SuggestGuestPreferencesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const guestHistory = `
      Name: ${guest.name}
      Total Stays: ${guest.totalStays}
      Current Preferences: ${guest.preferences}
      Stay History:
      ${guest.stayHistory.map(stay => `
        - Check-in: ${stay.checkInDate}, Check-out: ${stay.checkOutDate}
        - Room: ${stay.roomType}
        - Notes: ${stay.notes}
      `).join('')}
    `;

    try {
      const result = await suggestGuestPreferences({ guestHistory });
      setSuggestions(result);
    } catch (e) {
      setError('Failed to get suggestions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Preference Suggester
        </CardTitle>
        <CardDescription>
          Analyze guest history to suggest personalized perks and offers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button onClick={getSuggestions} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Suggestions'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {suggestions && (
            <div className="space-y-4 pt-4">
              <div>
                <h4 className="font-semibold font-headline">Reasoning</h4>
                <p className="text-sm text-muted-foreground">{suggestions.reasoning}</p>
              </div>
              {suggestions.suggestions && suggestions.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold font-headline">Suggestions</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {suggestions.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
               {suggestions.suggestions && suggestions.suggestions.length === 0 && (
                 <p className="text-sm text-muted-foreground italic">No specific new perks suggested based on the current history.</p>
               )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
