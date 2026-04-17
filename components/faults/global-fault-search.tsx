"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Wrench, Zap, FileText, ShieldAlert, Car, Loader2 } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useFaultSearch } from "@/hooks/use-faults";
import { Badge } from "@/components/ui/badge";

export function GlobalFaultSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const { faults, isLoading } = useFaultSearch(query);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="🔍 Buscar fallas por DTC, síntoma o vehículo..."
        value={query}
        onValueChange={setQuery}
      />
      {/* AQUÍ ESTÁ LA MAGIA: h-[400px] bloquea la altura para que no salte */}
      <CommandList className="h-[400px] max-h-[400px] overflow-y-auto">
        <CommandEmpty>
          {isLoading ? (
            <div className="flex h-[300px] w-full flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="mb-4 h-8 w-8 animate-spin opacity-50" />
              <p>Analizando base técnica...</p>
            </div>
          ) : (
            <div className="flex h-[300px] w-full flex-col items-center justify-center text-muted-foreground text-center px-4">
              <ShieldAlert className="mb-4 h-10 w-10 opacity-20 text-destructive" />
              <p className="font-medium text-foreground">
                No hay resultados para "{query}"
              </p>
              <p className="text-sm mt-1">
                Intenta con códigos DTC (P0XXX) o síntomas generales.
              </p>
            </div>
          )}
        </CommandEmpty>

        {faults && faults.length > 0 && (
          <CommandGroup heading="Diagnósticos Sugeridos">
            {faults.map((fault: any) => (
              <CommandItem
                key={fault.id}
                value={`${fault.code} ${fault.title} ${fault.symptoms}`}
                onSelect={() => {
                  runCommand(() =>
                    router.push(`/faults?search=${fault.code || fault.id}`),
                  );
                }}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer my-1 border border-transparent aria-selected:border-border aria-selected:bg-muted/50 rounded-lg transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    <span className="font-bold">{fault.title}</span>
                  </div>
                  {fault.code && (
                    <Badge
                      variant="destructive"
                      className="font-mono text-[10px]"
                    >
                      {fault.code}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1 pl-6">
                  {fault.symptoms}
                </span>
                <div className="flex gap-2 mt-1 pl-6">
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-secondary/50"
                  >
                    <Zap className="w-3 h-3 mr-1 inline-block" />
                    {fault.affectedSystems}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-border/50"
                  >
                    {fault.severity}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Atajos de Navegación">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/quotations"))}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Crear Nueva Cotización</span>
            <CommandShortcut>⌘ R</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/vehicles"))}
            className="cursor-pointer"
          >
            <Car className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Ver Inventario de Vehículos</span>
            <CommandShortcut>⌘ V</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
