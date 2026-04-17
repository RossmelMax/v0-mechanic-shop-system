import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Wrench,
  Car,
  Users,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Shield,
  Clock,
  Award
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AutoMec</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Sistema de Gestión para Talleres Mecánicos
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gestiona tu taller con
            <span className="text-blue-600"> inteligencia artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Optimiza tus operaciones, diagnostica problemas automáticamente y aumenta tus ganancias
            con nuestro sistema completo de gestión para talleres mecánicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Ver Características
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu taller
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una plataforma completa que cubre desde la recepción del cliente hasta la facturación final.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Gestión de Clientes</CardTitle>
                <CardDescription>
                  Mantén un registro completo de tus clientes y su historial de servicios.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Car className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Control de Vehículos</CardTitle>
                <CardDescription>
                  Registra todos los detalles técnicos de cada vehículo atendido.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Wrench className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Diagnóstico Inteligente</CardTitle>
                <CardDescription>
                  Nuestra base de datos sugiere soluciones basadas en síntomas reportados.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Órdenes de Trabajo</CardTitle>
                <CardDescription>
                  Gestiona el flujo completo de trabajo desde cotización hasta entrega.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Inventario</CardTitle>
                <CardDescription>
                  Controla tu stock de repuestos y recibe alertas de productos bajos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Award className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Reportes</CardTitle>
                <CardDescription>
                  Obtén insights valiosos sobre el rendimiento de tu taller.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Servicios que ofrecemos
            </h2>
            <p className="text-lg text-gray-600">
              Especialistas en mantenimiento y reparación de vehículos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Mantenimiento Preventivo",
              "Reparación de Motor",
              "Sistema Eléctrico",
              "Transmisión",
              "Frenos y Suspensión",
              "Diagnóstico Computarizado",
              "Aire Acondicionado",
              "Escape y Admision"
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Excelente servicio y atención. El sistema de diagnóstico nos ayudó a identificar
                  el problema rápidamente. Muy recomendado."
                </p>
                <div className="font-semibold">María González</div>
                <div className="text-sm text-gray-500">Propietaria de Toyota Corolla</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Profesionales y eficientes. El seguimiento en tiempo real del estado de mi
                  vehículo me mantuvo informado en todo momento."
                </p>
                <div className="font-semibold">Carlos Rodríguez</div>
                <div className="text-sm text-gray-500">Propietario de Ford Ranger</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "La mejor experiencia en un taller. Transparente, rápido y con precios justos.
                  Definitivamente volveré."
                </p>
                <div className="font-semibold">Ana López</div>
                <div className="text-sm text-gray-500">Propietaria de Honda Civic</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para revolucionar tu taller?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a cientos de talleres que ya confían en nuestro sistema para optimizar sus operaciones.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">AutoMec</span>
              </div>
              <p className="text-gray-400">
                Sistema integral de gestión para talleres mecánicos modernos.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Mantenimiento</li>
                <li>Reparaciones</li>
                <li>Diagnóstico</li>
                <li>Consultoría</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre nosotros</li>
                <li>Carreras</li>
                <li>Contacto</li>
                <li>Soporte</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@automech.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Ciudad, País</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AutoMec. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
