export type DemoRole = 'RIDER' | 'ADMIN' | 'OPERATOR';

export type DemoUser = {
  id: string;
  role: DemoRole;
  name: string;
  email: string;
  password: string;
};

export const demoUsers: DemoUser[] = [
  {
    id: 'demo_user_seed',
    role: 'RIDER',
    name: 'Demo Rider',
    email: 'demo@moon.local',
    password: 'demo123',
  },
  {
    id: 'demo_admin_seed',
    role: 'ADMIN',
    name: 'Moon Admin',
    email: 'admin@moon.local',
    password: 'admin123',
  },
  {
    id: 'demo_operator_seed',
    role: 'OPERATOR',
    name: 'Metro Operator',
    email: 'operator@moon.local',
    password: 'operator123',
  },
];

export const demoAuthCookie = 'moon_demo_role';

export function getDemoUserByRole(role?: string | null) {
  return demoUsers.find((user) => user.role === role) ?? null;
}

export function getDemoUserByEmail(email?: string | null) {
  return demoUsers.find((user) => user.email.toLowerCase() === email?.toLowerCase()) ?? null;
}
