import ky from 'ky';

export const apiClient = ky.create({
  prefixUrl: 'http://localhost:4000/v1',
  timeout: 10000
});
