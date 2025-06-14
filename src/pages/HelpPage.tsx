
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UserManual from '@/components/help/UserManual';
import FAQ from '@/components/help/FAQ';
import { useHelpTour } from '@/hooks/useHelpTour';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  HelpCircle, 
  Play, 
  FileText, 
  Video, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const { startTour, hasCompletedTour } = useHelpTour();
  const isMobile = useIsMobile();

  const quickActions = [
    {
      title: 'Tour Guiado',
      description: 'Recorrido interactivo por las principales funciones',
      icon: Play,
      action: () => startTour(),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Manual PDF',
      description: 'Descarga la guía completa en formato PDF',
      icon: FileText,
      action: () => window.open('/manual.pdf', '_blank'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Videos Tutoriales',
      description: 'Aprende con nuestros videos explicativos',
      icon: Video,
      action: () => window.open('https://help.inmel.com/videos', '_blank'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Contactar Soporte',
      description: 'Obtén ayuda personalizada de nuestro equipo',
      icon: MessageCircle,
      action: () => window.open('mailto:soporte@inmel.com', '_blank'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
        <Navbar 
          title="Centro de Ayuda" 
          subtitle="Encuentra la información que necesitas"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Acciones rápidas */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={action.action}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tour status */}
          {hasCompletedTour && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Tour Completado</h4>
                      <p className="text-sm text-green-600">Ya completaste el tour guiado del sistema</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={startTour}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Repetir Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contenido principal */}
          <Tabs defaultValue="manual" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Manual de Usuario
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Preguntas Frecuentes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6">
              <UserManual />
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <FAQ />
            </TabsContent>
          </Tabs>

          {/* Links adicionales */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Recursos Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Base de Conocimiento</p>
                  <p className="text-sm text-muted-foreground">Artículos detallados y guías avanzadas</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Comunidad de Usuarios</p>
                  <p className="text-sm text-muted-foreground">Conecta con otros usuarios y comparte experiencias</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;
