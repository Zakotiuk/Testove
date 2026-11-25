import { expect, test as baseTest } from '@playwright/test';
import { BookingApi, type Booking, type Credentials } from './booking-api';

const { BOOKER_USERNAME: username, BOOKER_PASSWORD: password } = process.env;

if (!username || !password) {
  throw new Error('Set BOOKER_USERNAME and BOOKER_PASSWORD via .env or .env.example.');
}

export const bookerCredentials: Credentials = { username, password };

export const test = baseTest.extend<{
  bookingApi: BookingApi;
  createBooking: (booking: Booking, token: string) => Promise<number>;
}>({
  bookingApi: async ({ request }, use) => {
    await use(new BookingApi(request));
  },
  createBooking: async ({ bookingApi }, use) => {
    const createdBookings = new Map<number, { firstname: string; token: string }>();

    await use(async (booking, token) => {
      const response = await bookingApi.create(booking);
      await expect(response, 'POST /booking succeeds').toBeOK();

      const body = await response.json();
      const id: unknown = body.bookingid;
      if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
        throw new Error('POST /booking did not return a positive integer booking ID.');
      }
      createdBookings.set(id, { firstname: booking.firstname, token });

      expect(response.status(), 'POST /booking status').toBe(200);
      expect(body.booking, 'Created booking matches the submitted data').toEqual(booking);
      return id;
    });

    for (const [id, { firstname, token }] of createdBookings) {
      const lookup = await bookingApi.get(id);
      if (lookup.status() === 404) {
        continue;
      }

      await expect(lookup, `Look up test booking ${id} before cleanup`).toBeOK();
      const booking = await lookup.json();
      if (booking.firstname !== firstname) {
        continue;
      }

      const deletion = await bookingApi.delete(id, token);
      expect([201, 405], `Clean up test booking ${id}`).toContain(deletion.status());

      const afterDeletion = await bookingApi.get(id);
      expect(afterDeletion.status(), `Test booking ${id} is gone after cleanup`).toBe(404);
    }
  },
});
