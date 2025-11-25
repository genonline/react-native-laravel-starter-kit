import api from './api';

export async function login(credentials: { email: string; password: string; device_name: string }) {
  const { data } = await api.post('/login', credentials);

  return data.token;
}

export async function logout() {
  await api.post('/logout', {});
}

export async function register(form: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name: string;
}) {
  const { data } = await api.post('/register', form);

  return data.token;
}

export async function forgotPassword(form: { email: string }) {
  await api.post('/forgot-password', form);
}

export async function resetPassword(form: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  await api.post('/reset-password', form);
}
