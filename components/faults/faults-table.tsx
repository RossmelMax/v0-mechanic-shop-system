"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFaults, useFaultSearch } from "@/hooks/use-faults";
import { AlertTriangle, Wrench, Search, Zap } from "lucide-react";

export function FaultsTable() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  // Manejo de la búsqueda en tiempo real
  const searchSystem = selectedSystem === "all" ? "" : selectedSystem;
  const searchSeverity = selectedSeverity === "all" ? "" : selectedSeverity;

  const { faults: searchResults } = useFaultSearch(searchQuery, {
    system: searchSystem,
    severity: searchSeverity,
  });

  const { faults: listFaults, isLoading } = useFaults(page);

  const faults =
    searchQuery || searchSystem || searchSeverity ? searchResults : listFaults;

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "alta":
        return "destructive";
      case "media":
        return "warning";
      case "baja":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código DTC, síntoma o palabra clave..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={selectedSystem}
            onValueChange={setSelectedSystem}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sistema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los sistemas</SelectItem>
              <SelectItem value="Motor">Motor</SelectItem>
              <SelectItem value="Transmisión">Transmisión</SelectItem>
              <SelectItem value="Frenos">Frenos</SelectItem>
              <SelectItem value="Eléctrico">Eléctrico</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedSeverity}
            onValueChange={setSelectedSeverity}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier Severidad</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Título / Falla</TableHead>
              <TableHead>Sistema</TableHead>
              <TableHead>Severidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Cargando base de conocimiento...
                </TableCell>
              </TableRow>
            ) : faults?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-20" />
                    <p>
                      No se encontraron diagnósticos que coincidan con la
                      búsqueda.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              faults?.map((fault: any) => (
                <TableRow
                  key={fault.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-mono font-semibold text-primary">
                    {fault.code || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{fault.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {fault.symptoms}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      {fault.affectedSystems?.includes("Motor") && (
                        <Zap className="h-3 w-3 text-orange-500" />
                      )}
                      {fault.affectedSystems}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(fault.severity) as any}>
                      {fault.severity || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Wrench className="w-3 h-3 mr-1" />
                      Ver Solución
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
