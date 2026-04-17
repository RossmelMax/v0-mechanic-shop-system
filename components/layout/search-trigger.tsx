"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchTrigger() {
  return (
    <Button
      variant="outline"
      className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none hover:bg-muted/80 transition-colors sm:pr-12 md:w-64 lg:w-80"
      onClick={() => {
        // Disparamos el evento global que escucha nuestro Command Palette
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      }}
    >
      <Search className="mr-2 h-4 w-4 opacity-50" />
      <span className="hidden lg:inline-flex">Buscar diagnóstico o DTC...</span>
      <span className="inline-flex lg:hidden">Buscar...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
