import type { APIRequestContext } from '@playwright/test';

export type Credentials = {
  username: string;
  password: string;
};

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
};

export class BookingApi {
  constructor(private readonly request: APIRequestContext) {}

  authenticate(credentials: Credentials) {
    return this.request.post('/auth', { data: credentials });
  }

  create(booking: Booking) {
    return this.request.post('/booking', { data: booking });
  }

  get(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  update(id: number, booking: Booking, token?: string) {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }

  delete(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  }
}
