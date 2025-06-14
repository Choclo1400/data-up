
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Rating, RatingStats, CreateRatingData } from '@/types/ratings';

// Mock data de calificaciones
const mockRatings: Rating[] = [
  {
    id: "RAT-001",
    requestId: "REQ-001",
    clientId: "CLI-001",
    clientName: "Enel Distribución Chile",
    technicianId: "TEC-001",
    technicianName: "Juan Pérez",
    rating: 5,
    comment: "Excelente servicio, muy profesional y rápido",
    createdDate: "2024-06-12T10:30:00Z",
    requestTitle: "Instalación de medidor inteligente",
    serviceType: "Instalación"
  },
  {
    id: "RAT-002",
    requestId: "REQ-002",
    clientId: "CLI-002",
    clientName: "CGE Distribución",
    technicianId: "TEC-002",
    technicianName: "María González",
    rating: 4,
    comment: "Buen trabajo, llegó a tiempo",
    createdDate: "2024-06-11T14:15:00Z",
    requestTitle: "Mantenimiento preventivo transformador",
    serviceType: "Mantenimiento"
  },
  {
    id: "RAT-003",
    requestId: "REQ-003",
    clientId: "CLI-001",
    clientName: "Enel Distribución Chile",
    technicianId: "TEC-003",
    technicianName: "Carlos López",
    rating: 5,
    comment: "Resolvió la emergencia muy rápido, excelente técnico",
    createdDate: "2024-06-10T16:45:00Z",
    requestTitle: "Reparación de falla eléctrica",
    serviceType: "Emergencia"
  },
  {
    id: "RAT-004",
    requestId: "REQ-004",
    clientId: "CLI-003",
    clientName: "Saesa",
    technicianId: "TEC-001",
    technicianName: "Juan Pérez",
    rating: 4,
    comment: "Trabajo bien realizado",
    createdDate: "2024-06-09T11:20:00Z",
    requestTitle: "Inspección de equipos",
    serviceType: "Inspección"
  },
  {
    id: "RAT-005",
    requestId: "REQ-005",
    clientId: "CLI-002",
    clientName: "CGE Distribución",
    technicianId: "TEC-002",
    technicianName: "María González",
    rating: 5,
    comment: "Muy satisfechos con el servicio",
    createdDate: "2024-06-08T09:10:00Z",
    requestTitle: "Reparación menor",
    serviceType: "Reparación"
  }
];

export const useRatings = () => {
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);

  const createRating = useCallback(async (ratingData: CreateRatingData) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRating: Rating = {
        id: `RAT-${Date.now()}`,
        requestId: ratingData.requestId,
        clientId: "CLI-001", // En un sistema real esto vendría de la solicitud
        clientName: "Cliente Example",
        technicianId: "TEC-001",
        technicianName: "Técnico Example",
        rating: ratingData.rating,
        comment: ratingData.comment,
        createdDate: new Date().toISOString(),
        requestTitle: "Solicitud Example",
        serviceType: "Servicio Example"
      };
      
      setRatings(prev => [newRating, ...prev]);
      
      toast.success('Calificación Enviada', {
        description: 'Gracias por calificar nuestro servicio'
      });
      
      return newRating;
    } catch (error) {
      toast.error('Error', {
        description: 'No se pudo enviar la calificación'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRatingStats = useCallback((): RatingStats => {
    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {},
        monthlyTrend: []
      };
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    const ratingDistribution = ratings.reduce((acc, rating) => {
      acc[rating.rating] = (acc[rating.rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    // Calcular tendencia mensual (últimos 6 meses)
    const monthlyTrend = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    
    for (let i = 0; i < 6; i++) {
      const monthRatings = ratings.filter(rating => {
        const ratingMonth = new Date(rating.createdDate).getMonth();
        return ratingMonth === i;
      });
      
      const monthAvg = monthRatings.length > 0 
        ? monthRatings.reduce((sum, r) => sum + r.rating, 0) / monthRatings.length 
        : 0;
      
      monthlyTrend.push({
        month: months[i],
        rating: Number(monthAvg.toFixed(1)),
        count: monthRatings.length
      });
    }

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings: ratings.length,
      ratingDistribution,
      monthlyTrend
    };
  }, [ratings]);

  const getRatingsByTechnician = useCallback((technicianId: string) => {
    return ratings.filter(rating => rating.technicianId === technicianId);
  }, [ratings]);

  const getRatingsByClient = useCallback((clientId: string) => {
    return ratings.filter(rating => rating.clientId === clientId);
  }, [ratings]);

  return {
    ratings,
    loading,
    createRating,
    getRatingStats,
    getRatingsByTechnician,
    getRatingsByClient
  };
};
