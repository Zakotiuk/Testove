import { randomUUID } from 'node:crypto';
import { expect } from '@playwright/test';
import type { Booking, BookingApi } from './booking-api';
import { bookerCredentials, test } from './booking-fixture';

function newBooking(): Booking {
  return {
    firstname: `Test-${randomUUID()}`,
    lastname: 'Booker',
    totalprice: 125,
    depositpaid: false,
    bookingdates: { checkin: '2028-05-10', checkout: '2028-05-13' },
    additionalneeds: 'Breakfast',
  };
}

function authenticate(bookingApi: BookingApi): Promise<string> {
  return test.step('Authenticate and obtain a booking token', async () => {
    const response = await bookingApi.authenticate(bookerCredentials);

    expect(response.status(), 'POST /auth status').toBe(200);
    const { token }: { token?: unknown } = await response.json();
    if (typeof token !== 'string' || token.trim() === '') {
      throw new Error('POST /auth did not return a non-empty token.');
    }
    return token;
  });
}

test('authenticates, creates, updates, deletes and verifies the booking is gone', { tag: '@main' }, async ({
  bookingApi, createBooking,
}) => {
  const token = await authenticate(bookingApi);
  const booking = newBooking();
  const id = await test.step('Create a booking and read back the saved data', async () => {
    const bookingId = await createBooking(booking, token);
    const read = await bookingApi.get(bookingId);

    expect(read.status(), 'GET /booking/:id after creation').toBe(200);
    expect(await read.json()).toEqual(booking);
    return bookingId;
  });
  const updatedBooking = { ...booking, totalprice: 185, depositpaid: true, additionalneeds: 'Late check-in' };

  await test.step('Update the booking and read back the saved data', async () => {
    const update = await bookingApi.update(id, updatedBooking, token);
    expect(update.status(), 'PUT /booking/:id status').toBe(200);
    expect(await update.json()).toEqual(updatedBooking);

    const read = await bookingApi.get(id);
    expect(read.status(), 'GET /booking/:id after update').toBe(200);
    expect(await read.json()).toEqual(updatedBooking);
  });

  await test.step('Delete the booking and verify it is absent', async () => {
    const deletion = await bookingApi.delete(id, token);
    expect(deletion.status(), 'DELETE /booking/:id status').toBe(201);

    const read = await bookingApi.get(id);
    expect(read.status(), 'GET /booking/:id after deletion').toBe(404);
  });
});

test('rejects invalid credentials without issuing a token', { tag: '@edge' }, async ({ bookingApi }) => {
  const response = await bookingApi.authenticate({ ...bookerCredentials, password: randomUUID() });

  expect(response.status(), 'POST /auth reports invalid credentials in the body').toBe(200);
  expect(await response.json()).toEqual({ reason: 'Bad credentials' });
});

test('rejects an update without a token and leaves the booking intact', { tag: '@edge' }, async ({
  bookingApi, createBooking,
}) => {
  const token = await authenticate(bookingApi);
  const booking = newBooking();
  const id = await test.step('Create a booking for the unauthorized update', () => createBooking(booking, token));

  const update = await bookingApi.update(id, { ...booking, totalprice: 999 });
  expect(update.status(), 'PUT /booking/:id without credentials').toBe(403);

  const read = await bookingApi.get(id);
  expect(read.status(), 'GET /booking/:id after rejected update').toBe(200);
  expect(await read.json()).toEqual(booking);
});
