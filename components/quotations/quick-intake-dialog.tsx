"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Loader2, Plus, User, Wrench, Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { useClientVehicles } from "@/hooks/use-clients";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function QuickIntakeDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Estados para selección
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [vehicleSearchOpen, setVehicleSearchOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    licensePlate: "",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    symptoms: "",
  });

  // Hooks para datos
  const { clients, isLoading: clientsLoading } = useClients();
  const { vehicles, isLoading: vehiclesLoading } = useClientVehicles(selectedClientId);

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedVehicleId(""); // Reset vehicle when client changes
    setClientSearchOpen(false);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setVehicleSearchOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        clientId: selectedClientId || undefined,
        vehicleId: selectedVehicleId || undefined,
      };

      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar");

      const data = await res.json();

      toast({
        title: "¡Recepción exitosa! 🚀",
        description: `Se creó la cotización ${data.quotation.quotationNumber}`,
      });

      setOpen(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la recepción",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedClientId("");
    setSelectedVehicleId("");
    setFormData({
      clientName: "",
      clientPhone: "",
      licensePlate: "",
      make: "",
      model: "",
      year: "",
      symptoms: "",
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="h-5 w-5" />
          Recepción Rápida
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] border-none shadow-2xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            Nueva Recepción
          </DialogTitle>
          <DialogDescription className="text-gray-500 pt-1">
            Registra cliente y vehículo en un solo paso para iniciar el diagnóstico.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-5 border rounded-xl bg-gray-50/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                <User className="h-4 w-4" /> Cliente
              </div>

              {/* Selector de Cliente Existente */}
              <div className="space-y-2">
                <Label className="font-semibold">Buscar Cliente Existente</Label>
                <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientSearchOpen}
                      className="w-full justify-between bg-white"
                    >
                      {selectedClient ? selectedClient.name : "Seleccionar cliente existente..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar cliente..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                        <CommandGroup>
                          {clients.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.name}
                              onSelect={() => handleClientSelect(client.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedClientId === client.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {client.name}
                              {client.phone && <span className="ml-2 text-sm text-gray-500">({client.phone})</span>}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Campos para Nuevo Cliente */}
              <div className="space-y-2">
                <Label
                  htmlFor="clientName"
                  className="font-semibold"
                >
                  {selectedClient ? "O crear nuevo cliente" : "Nombre Completo *"}
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  required={!selectedClient}
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="bg-white"
                  disabled={!!selectedClient}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="clientPhone"
                  className="font-semibold"
                >
                  Teléfono
                </Label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="Ej. 70012345"
                  className="bg-white"
                  disabled={!!selectedClient}
                />
              </div>
            </div>

            <div className="space-y-4 p-5 border rounded-xl bg-gray-50/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 mb-2">
                <Car className="h-4 w-4" /> Vehículo
              </div>

              {/* Selector de Vehículo Existente */}
              {selectedClient && (
                <div className="space-y-2">
                  <Label className="font-semibold">Buscar Vehículo del Cliente</Label>
                  <Popover open={vehicleSearchOpen} onOpenChange={setVehicleSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={vehicleSearchOpen}
                        className="w-full justify-between bg-white"
                      >
                        {selectedVehicle
                          ? `${selectedVehicle.make} ${selectedVehicle.model} - ${selectedVehicle.licensePlate}`
                          : "Seleccionar vehículo existente..."
                        }
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar vehículo..." />
                        <CommandList>
                          <CommandEmpty>No se encontraron vehículos para este cliente.</CommandEmpty>
                          <CommandGroup>
                            {vehicles.map((vehicle) => (
                              <CommandItem
                                key={vehicle.id}
                                value={`${vehicle.make} ${vehicle.model} ${vehicle.licensePlate}`}
                                onSelect={() => handleVehicleSelect(vehicle.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedVehicleId === vehicle.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Campos para Nuevo Vehículo */}
              <div className="space-y-2">
                <Label
                  htmlFor="licensePlate"
                  className="font-semibold"
                >
                  {selectedVehicle ? "O registrar nuevo vehículo" : "Placa *"}
                </Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  required={!selectedVehicle}
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="Ej. 1234-ABC"
                  className="bg-white"
                  disabled={!!selectedVehicle}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="make"
                    className="font-semibold"
                  >
                    Marca *
                  </Label>
                  <Input
                    id="make"
                    name="make"
                    required={!selectedVehicle}
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="Ej. Toyota"
                    className="bg-white"
                    disabled={!!selectedVehicle}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="model"
                    className="font-semibold"
                  >
                    Modelo *
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    required={!selectedVehicle}
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ej. Corolla"
                    className="bg-white"
                    disabled={!!selectedVehicle}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="year"
                  className="font-semibold"
                >
                  Año
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2024"
                  className="bg-white"
                  disabled={!!selectedVehicle}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 border rounded-xl bg-gray-50/50">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              <Wrench className="h-4 w-4" /> Síntomas
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="symptoms"
                className="font-semibold"
              >
                Descripción del Problema *
              </Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                required
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe los síntomas que presenta el vehículo..."
                className="bg-white min-h-[100px]"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Recepción
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
