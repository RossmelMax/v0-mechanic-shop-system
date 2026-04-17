"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlobalFaultSearch } from "@/components/faults/global-fault-search";
import { SearchTrigger } from "@/components/layout/search-trigger";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wrench,
  Users,
  Car,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Zap,
  Package,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Vehículos", href: "/vehicles", icon: Car },
  { name: "Cotizaciones", href: "/quotations", icon: FileText },
  { name: "Órdenes", href: "/orders", icon: Wrench },
  { name: "Fallas", href: "/faults", icon: Zap },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Ventas", href: "/sales", icon: Receipt },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Intacto) */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <Wrench className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">AutoMec</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {session.user?.name || "Usuario"}
                    </span>
                    <span className="text-xs text-gray-500 truncate w-36 text-left">
                      {session.user?.email}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56"
              >
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content Wrapper */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top Bar con Buscador Global */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-white px-8 shadow-sm">
          <div className="flex-1 max-w-xl">
            <SearchTrigger />
          </div>
          <div className="hidden md:flex flex-1 justify-end items-center text-sm text-gray-500">
            <span>
              Tip: Presiona{" "}
              <kbd className="mx-1 rounded border bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-gray-900">
                Ctrl
              </kbd>
              +
              <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-gray-900">
                K
              </kbd>{" "}
              para buscar en cualquier momento
            </span>
          </div>
        </header>

        {/* Contenido de la página actual */}
        <main className="flex-1 p-8">{children}</main>
      </div>

      {/* El "Cerebro" (Buscador Global montado en el layout) */}
      <GlobalFaultSearch />
    </div>
  );
}
