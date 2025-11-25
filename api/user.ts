import api from './api';

export async function getUser() {
  const { data: user } = await api.get('/user');

  return user;
}

export async function updateUser(form: { name: string; email: string }) {
  await api.post('/user', form);
}

// TODO update password
