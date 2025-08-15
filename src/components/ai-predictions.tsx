
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, Loader2, AlertTriangle } from 'lucide-react';
import { suggestGuestPreferences } from '@/ai/flows/suggest-guest-preferences';
import type { SuggestGuestPreferencesOutput } from '@/ai/flows/suggest-guest-preferences';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Guest } from '@/types';

interface AIPredictionsProps {
  guest: Guest;
}

export function AIPredictions({ guest }: AIPredictionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<SuggestGuestPreferencesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);
    setPredictions(null);

    const guestStatus = guest.totalStays <= 1 ? 'New Guest' : 'Returning Guest';

    const guestHistory = `
      Guest Name: ${guest.name}
      Guest Status: ${guestStatus}
      Total Stays: ${guest.totalStays}
      Loyalty Tier: ${guest.loyaltyTier}
      
      Preferences Notes:
      ${guest.preferences}
      
      Stay History:
      ${guest.stayHistory.map(stay => 
        `- ${stay.hotelName}: ${stay.checkInDate} to ${stay.checkOutDate} (Room ${stay.roomNumber})`
      ).join('\n')}
      
      Communication History:
      ${guest.communicationHistory.map(comm => `- ${comm.date}: ${comm.log}`).join('\n')}
    `;

    try {
      const result = await suggestGuestPreferences({ guestHistory });
      setPredictions(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wand2 className="h-5 w-5" />
          AI Predictions
        </CardTitle>
        <CardDescription>Generate personalized suggestions for this guest.</CardDescription>
      </CardHeader>
      <CardContent>
        {!predictions && !isLoading && (
          <Button onClick={handleGenerateClick} disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</> : 'Generate Suggestions'}
          </Button>
        )}
        
        {isLoading && (
            <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Analyzing guest history and generating ideas...</span>
            </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {predictions && (
          <div className="space-y-4 text-sm">
            <div>
                <h4 className="font-semibold mb-2">Suggestions</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {predictions.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-2">Reasoning</h4>
                <p className="text-muted-foreground italic">"{predictions.reasoning}"</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPredictions(null)}>
              Generate Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
