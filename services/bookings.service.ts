// services/bookings.service.ts
import { Booking, BookingsData, StudentInfo, TutorInfo, ProfilePicture } from '@/interfaces/bookings.interfaces';

class BookingsService {
  private baseUrl = 'http://localhost:5000/api'; // Update this to your backend URL

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

  // Helper function to normalize profile picture data
  private normalizeProfilePicture(profilePicture: any): ProfilePicture | undefined {
    if (!profilePicture) {
      return undefined;
    }
    
    // Handle empty objects (like {})
    if (typeof profilePicture === 'object' && Object.keys(profilePicture).length === 0) {
      return undefined;
    }
    
    // Handle Cloudinary response object
    if (profilePicture.url && typeof profilePicture.url === 'string' && profilePicture.url.trim() !== '') {
      return {
        url: profilePicture.url,
        public_id: profilePicture.public_id || '',
        format: profilePicture.format || 'jpg',
        bytes: profilePicture.bytes || 0
      };
    }
    
    // Handle string URLs (convert to ProfilePicture object)
    if (typeof profilePicture === 'string' && profilePicture.trim() !== '') {
      return {
        url: profilePicture,
        public_id: '',
        format: 'jpg',
        bytes: 0
      };
    }
    
    return undefined;
  }

  // Helper function to transform API response to Booking
  private transformBookingData(item: any, type: 'sent' | 'received'): Booking {
    const baseBooking: Booking = {
      _id: item._id,
      studentId: item.studentId,
      tutorId: item.tutorId,
      sessionDate: item.sessionDate,
      duration: item.duration,
      price: item.price,
      course: Array.isArray(item.course) ? item.course[0] : (item.course || 'General'),
      comment: item.comment,
      tutorComment: item.tutorComment,
      status: item.status,
      modality: item.modality,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      // Meeting fields - will be populated when meetings are created
      meetingId: item.meetingId,
      roomId: item.roomId,
      meetingUrl: item.meetingUrl
    };

    // Add user info based on booking type
    if (type === 'sent' && item.tutorInfo) {
      baseBooking.tutorInfo = {
        _id: item.tutorInfo._id,
        username: item.tutorInfo.username,
        email: item.tutorInfo.email,
        program: item.tutorInfo.program,
        specialization: item.tutorInfo.specialization || '',
        profilePicture: this.normalizeProfilePicture(item.tutorInfo.profilePicture)
      };
    }

    if (type === 'received' && item.studentInfo) {
      baseBooking.studentInfo = {
        _id: item.studentInfo._id,
        username: item.studentInfo.username,
        email: item.studentInfo.email,
        program: item.studentInfo.program,
        specialization: item.studentInfo.specialization || '',
        profilePicture: this.normalizeProfilePicture(item.studentInfo.profilePicture)
      };
    }

    return baseBooking;
  }

  async fetchBookings(): Promise<BookingsData> {
    let sentBookings: Booking[] = [];
    let receivedBookings: Booking[] = [];
    let isTutor = false;

    // Fetch sent bookings (student requests)
    try {
      const sentRes = await this.fetchWithAuth<{ 
        message: string; 
        body: any[] 
      }>(`${this.baseUrl}/request/getstudentrequests`);
      
      sentBookings = (sentRes.body || []).map((item: any) => 
        this.transformBookingData(item, 'sent')
      );
    } catch (error: any) {
      if (!error.message.includes('404')) {
        console.error('Failed to fetch sent bookings:', error);
        throw new Error(`Failed to fetch sent bookings: ${error.message}`);
      }
    }

    // Try to fetch received bookings (will fail if user is not a tutor)
    try {
      const receivedRes = await this.fetchWithAuth<{ 
        message: string; 
        body: any[] 
      }>(`${this.baseUrl}/request/getrequests`);
      
      receivedBookings = (receivedRes.body || []).map((item: any) => 
        this.transformBookingData(item, 'received')
      );
      
      isTutor = true;
    } catch (error: any) {
      if (error.message.includes('403') || error.message.includes('401')) {
        // User is not a tutor - this is expected
        isTutor = false;
      } else if (!error.message.includes('404')) {
        console.error('Failed to fetch received bookings:', error);
        throw new Error(`Failed to fetch received bookings: ${error.message}`);
      }
    }

    return {
      sentBookings,
      receivedBookings,
      isTutor
    };
  }

  async updateBookingStatus(
    id: string, 
    status?: Booking["status"], 
    tutorComment?: string, 
    comment?: string
  ): Promise<Booking> {
    const requestBody: any = {};
    
    // Only include fields that are provided
    if (status) requestBody.status = status;
    if (tutorComment !== undefined) requestBody.tutorComment = tutorComment;
    if (comment !== undefined) requestBody.comment = comment;
    
    const data = await this.fetchWithAuth<{ body: any }>(`${this.baseUrl}/request/updaterequeststatus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });
    
    // Determine the type based on what was updated
    const type = comment !== undefined ? 'sent' : 'received';
    return this.transformBookingData(data.body, type);
  }

  async createMeetingForBooking(bookingId: string): Promise<{ meeting: any; booking: Booking }> {
    const data = await this.fetchWithAuth<{ meeting: any; booking: any }>(
      `${this.baseUrl}/meetings/meetings`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );

    return {
      meeting: data.meeting,
      booking: this.transformBookingData(data.booking, 'sent')
    };
  }
}

export const bookingsService = new BookingsService();