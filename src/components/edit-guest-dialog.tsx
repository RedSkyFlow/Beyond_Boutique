
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Guest } from '@/types';

interface EditGuestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  guest: Guest;
  onSave: (updatedGuest: Guest) => void;
}

export function EditGuestDialog({ isOpen, onOpenChange, guest, onSave }: EditGuestDialogProps) {
  const [name, setName] = useState(guest.name);
  const [email, setEmail] = useState(guest.email);
  const [phone, setPhone] = useState(guest.phone);
  const [preferences, setPreferences] = useState(guest.preferences);

  useEffect(() => {
    setName(guest.name);
    setEmail(guest.email);
    setPhone(guest.phone);
    setPreferences(guest.preferences);
  }, [guest]);

  const handleSave = () => {
    const updatedGuest = {
      ...guest,
      name,
      email,
      phone,
      preferences,
    };
    onSave(updatedGuest);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
          <DialogDescription>
            Make changes to the guest's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="preferences" className="text-right pt-2">
              Preferences
            </Label>
            <Textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
