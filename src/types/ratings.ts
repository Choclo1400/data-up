
export interface Rating {
  id: string;
  requestId: string;
  clientId: string;
  clientName: string;
  technicianId: string;
  technicianName: string;
  rating: number; // 1-5 estrellas
  comment?: string;
  createdDate: string;
  requestTitle: string;
  serviceType: string;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    [key: number]: number; // rating -> count
  };
  monthlyTrend: {
    month: string;
    rating: number;
    count: number;
  }[];
}

export interface CreateRatingData {
  requestId: string;
  rating: number;
  comment?: string;
}
