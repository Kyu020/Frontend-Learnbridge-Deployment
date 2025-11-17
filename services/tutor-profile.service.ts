import { Tutor, Review, ScheduleFormData, ReviewFormData, CompleteTutorProfile } from '@/interfaces/tutors.interfaces';

class TutorProfileService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  private getToken(): string {
    if (typeof window === 'undefined') {
      throw new Error("Cannot access localStorage on server side");
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }

    return token;
  }

  private async fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async fetchTutorProfile(studentId: string): Promise<{ data: CompleteTutorProfile }> {
    return this.fetchWithAuth<{ data: CompleteTutorProfile }>(`${this.baseUrl}/tutor/gettutor/${studentId}`);
  }

  async fetchTutorReviews(tutorId: string): Promise<Review[]> {
    try {
      const data = await this.fetchWithAuth<any>(`${this.baseUrl}/reviews/getreviews/${tutorId}`);
      
      let reviewsData = data;
      if (reviewsData && typeof reviewsData === 'object' && !Array.isArray(reviewsData)) {
        reviewsData = reviewsData.reviews || reviewsData.data || [];
      }
      
      const safeReviewsData = Array.isArray(reviewsData) ? reviewsData : [];
      
      return safeReviewsData.map((review: any) => ({
        _id: review._id,
        studentId: review.studentId,
        tutorId: review.tutorId,
        rating: review.rating,
        comment: review.comment,
        studentName: review.student?.username || review.studentName || 'Anonymous Student',
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }));
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('400')) {
        return [];
      }
      throw error;
    }
  }

  async fetchFavorites(): Promise<string[]> {
    const data = await this.fetchWithAuth<{ favorites: any[] }>(`${this.baseUrl}/favorites/getfave`);
    return data.favorites
      ?.filter((fav: any) => fav.tutorId)
      .map((fav: any) => fav.tutorId) || [];
  }

  async scheduleSession(scheduleData: ScheduleFormData & { tutorId: string }): Promise<void> {
    const formattedData = {
      tutorId: scheduleData.tutorId,
      sessionDate: new Date(`${scheduleData.sessionDate}T${scheduleData.sessionTime}`).toISOString(),
      duration: parseInt(scheduleData.duration),
      price: parseFloat(scheduleData.price),
      course: scheduleData.course,
      comment: scheduleData.comment || "I would like to schedule a tutoring session",
      modality: scheduleData.modality 
    };

    await this.fetchWithAuth(`${this.baseUrl}/request/sendrequest`, {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  async submitReview(reviewData: ReviewFormData & { tutorId: string }): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/reviews/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(tutorId: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/reviews/deletereview/${tutorId}`, {
      method: 'DELETE',
    });
  }

  async addFavorite(tutorId: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/addfave`, {
      method: 'POST',
      body: JSON.stringify({ tutorId }),
    });
  }

  async removeFavorite(tutorId: string): Promise<void> {
    await this.fetchWithAuth(`${this.baseUrl}/favorites/removefave`, {
      method: 'POST',
      body: JSON.stringify({ tutorId }),
    });
  }
}

export const tutorProfileService = new TutorProfileService();