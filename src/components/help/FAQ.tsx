
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const faqItems: FAQItem[] = [
    {
      category: 'Cuenta y Acceso',
      question: '¿Cómo puedo cambiar mi contraseña?',
      answer: 'Ve a tu perfil de usuario y selecciona "Cambiar contraseña". Ingresa tu contraseña actual y la nueva contraseña dos veces para confirmar.'
    },
    {
      category: 'Cuenta y Acceso',
      question: '¿Qué hago si olvido mi contraseña?',
      answer: 'En la pantalla de login, haz clic en "¿Olvidaste tu contraseña?" e ingresa tu email. Recibirás un enlace para restablecer tu contraseña.'
    },
    {
      category: 'Cuenta y Acceso',
      question: '¿Cómo activo la autenticación de dos factores?',
      answer: 'Ve a Configuración > Seguridad y activa la opción "Autenticación de dos factores". Sigue las instrucciones para vincular tu dispositivo.'
    },
    {
      category: 'Solicitudes',
      question: '¿Cómo creo una nueva solicitud?',
      answer: 'Haz clic en "Nueva Solicitud" en el menú principal. Completa todos los campos requeridos y adjunta los documentos necesarios antes de enviar.'
    },
    {
      category: 'Solicitudes',
      question: '¿Puedo editar una solicitud después de enviarla?',
      answer: 'Solo puedes editar solicitudes en estado "Borrador". Una vez enviada, solo puedes agregar comentarios o documentos adicionales.'
    },
    {
      category: 'Solicitudes',
      question: '¿Cómo puedo ver el estado de mi solicitud?',
      answer: 'Ve a "Mis Solicitudes" donde verás todas tus solicitudes con su estado actual. También recibirás notificaciones por email cuando cambien de estado.'
    },
    {
      category: 'Sistema',
      question: '¿Por qué no puedo acceder a ciertas secciones?',
      answer: 'El acceso a las secciones depende de tu rol y permisos. Si necesitas acceso adicional, contacta a tu supervisor o administrador.'
    },
    {
      category: 'Sistema',
      question: '¿Cómo reporto un problema técnico?',
      answer: 'Crea una solicitud de tipo "Soporte Técnico" describiendo el problema en detalle. Include capturas de pantalla si es posible.'
    },
    {
      category: 'Sistema',
      question: '¿El sistema funciona en dispositivos móviles?',
      answer: 'Sí, el sistema es completamente responsive y funciona en smartphones y tablets a través del navegador web.'
    },
    {
      category: 'Notificaciones',
      question: '¿Cómo configuro mis notificaciones?',
      answer: 'Ve a Configuración > Notificaciones donde puedes activar/desactivar diferentes tipos de notificaciones por email y en el sistema.'
    },
    {
      category: 'Notificaciones',
      question: '¿Por qué no recibo notificaciones por email?',
      answer: 'Verifica que tu email esté correctamente configurado en tu perfil y revisa tu carpeta de spam. También verifica la configuración de notificaciones.'
    }
  ];

  const categories = [...new Set(faqItems.map(item => item.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
          <p className="text-muted-foreground">
            Respuestas a las dudas más comunes sobre el sistema
          </p>
        </div>
      </div>

      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems
                .filter(item => item.category === category)
                .map((item, index) => (
                  <AccordionItem key={index} value={`${category}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FAQ;
