'use client';
import React, { useState, useEffect } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Search, FileText, Users, Calendar, Settings, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key==='k'&&(e.metaKey||e.ctrlKey)) { e.preventDefault(); setOpen(o=>!o); } };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button variant="outline" className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2" onClick={()=>setOpen(true)}>
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] xl:flex">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={()=>{router.push('/board');setOpen(false);}}><Plus className="mr-2 h-4 w-4"/>Create Task</CommandItem>
            <CommandItem onSelect={()=>{router.push('/teams');setOpen(false);}}><Users className="mr-2 h-4 w-4"/>View Teams</CommandItem>
            <CommandItem onSelect={()=>{router.push('/calendar');setOpen(false);}}><Calendar className="mr-2 h-4 w-4"/>Calendar</CommandItem>
            <CommandItem onSelect={()=>{router.push('/settings');setOpen(false);}}><Settings className="mr-2 h-4 w-4"/>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}