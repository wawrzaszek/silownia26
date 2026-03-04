export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
};

export function saveToken(token: string): void {
  localStorage.setItem('accessToken', token);
}

export function clearToken(): void {
  localStorage.removeItem('accessToken');
}
