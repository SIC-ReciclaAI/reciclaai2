import ky from 'ky';
import { API_BASE_URL } from '@/lib/env';

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000
});
