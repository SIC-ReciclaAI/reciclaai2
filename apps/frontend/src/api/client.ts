import ky from 'ky';

export const apiClient = ky.create({
  prefixUrl: 'https://localhost:8000',
  timeout: 10000
});
