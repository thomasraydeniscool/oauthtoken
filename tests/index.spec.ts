import { AccessToken } from '../src';

const mockTokenResponse = { access_token: '', expires_in: 100 };

const mockTokenExpiredResponse = { access_token: '', expires_in: -100 };

test('new token should not be expired', () => {
  expect(new AccessToken(mockTokenResponse).expired()).toBe(false);
});

test('expired token should be expired', () => {
  expect(new AccessToken(mockTokenExpiredResponse).expired()).toBe(true);
});

test('new token contains original response', () => {
  expect(new AccessToken(mockTokenResponse).token).toMatchObject(
    mockTokenResponse
  );
});

test('new token contains expires_at', () => {
  expect(new AccessToken(mockTokenResponse).token).toHaveProperty('expires_at');
});
