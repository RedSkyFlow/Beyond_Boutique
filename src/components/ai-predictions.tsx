
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, Loader2, AlertTriangle, ChevronDown } from 'lucide-react';
import { suggestGuestPreferences } from '@/ai/flows/suggest-guest-preferences';
import type { SuggestGuestPreferencesOutput } from '@/ai/flows/suggest-guest-preferences';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Guest, GuestStatus } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';


interface AIPredictionsProps {
  guest: Guest;
}

const statusBadgeConfig: Record<GuestStatus, string> = {
    'Checked-in': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    'Arriving Soon': 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    'Checked-out': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100',
    'Prospect': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
};


export function AIPredictions({ guest }: AIPredictionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<SuggestGuestPreferencesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleGenerateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the collapsible from toggling when clicking the button
    setIsLoading(true);
    setError(null);
    setPredictions(null);
    setIsOpen(true); // Open the collapsible when generating

    const guestType = guest.totalStays <= 1 ? 'New Guest' : 'Returning Guest';

    const guestHistory = `
      Guest Name: ${guest.name}
      Guest Type: ${guestType}
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
      const result = await suggestGuestPreferences({ 
        guestHistory,
        guestStatus: guest.status 
      });
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
            <div className="cursor-pointer p-6" role="button">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Wand2 className="h-5 w-5" />
                      AI Predictions
                    </CardTitle>
                    <CardDescription>Generate personalized suggestions for this guest based on their status.</CardDescription>
                  </div>
                   <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
              </CardHeader>
            </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <CardContent>
              {!predictions && !isLoading && (
                <Button onClick={handleGenerateClick} disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</> : 'Generate Suggestions'}
                </Button>
              )}
              
              {isLoading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Analyzing guest data and generating ideas...</span>
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
                      <div className="font-semibold mb-2 flex items-center gap-2">
                        <span>Suggestions for a</span>
                        <Badge className={cn("font-bold", statusBadgeConfig[guest.status])}>
                            {guest.status}
                        </Badge>
                        <span>guest</span>
                      </div>
                      {predictions.suggestions.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                              {predictions.suggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                              ))}
                          </ul>
                      ) : (
                          <p className="text-muted-foreground">No specific suggestions generated based on the guest's history.</p>
                      )}
                  </div>
                  <div>
                      <h4 className="font-semibold mb-2">Reasoning</h4>
                      <p className="text-muted-foreground italic">"{predictions.reasoning}"</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleGenerateClick} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Again'}
                  </Button>
                </div>
              )}
            </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
