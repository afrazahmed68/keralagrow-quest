import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'farmer' | 'admin';
  panchayat: string;
  sustainabilityScore: number;
  level: number;
  totalPoints: number;
  badges: Badge[];
  avatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold';
  earnedAt: Date;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: 'admin',
    username: 'admin',
    name: 'Admin User',
    role: 'admin',
    panchayat: 'Central Office',
    sustainabilityScore: 100,
    level: 10,
    totalPoints: 5000,
    badges: [],
  },
  {
    id: 'farmer1',
    username: 'farmer1',
    name: 'Ravi Kumar',
    role: 'farmer',
    panchayat: 'Thiruvalla',
    sustainabilityScore: 78,
    level: 5,
    totalPoints: 1560,
    badges: [
      {
        id: 'eco-warrior',
        name: 'Eco Warrior',
        description: 'Completed 10 sustainable farming quests',
        icon: '🌱',
        type: 'gold',
        earnedAt: new Date('2024-01-15'),
      },
      {
        id: 'water-saver',
        name: 'Water Saver',
        description: 'Implemented water conservation techniques',
        icon: '💧',
        type: 'silver',
        earnedAt: new Date('2024-02-20'),
      },
    ],
  },
  {
    id: 'farmer2',
    username: 'farmer2',
    name: 'Priya Nair',
    role: 'farmer',
    panchayat: 'Kumbakonam',
    sustainabilityScore: 85,
    level: 6,
    totalPoints: 1870,
    badges: [
      {
        id: 'organic-champion',
        name: 'Organic Champion',
        description: 'Achieved 100% organic farming certification',
        icon: '🏆',
        type: 'gold',
        earnedAt: new Date('2024-01-10'),
      },
    ],
  },
  {
    id: 'farmer3',
    username: 'farmer3',
    name: 'Suresh Menon',
    role: 'farmer',
    panchayat: 'Palakkad',
    sustainabilityScore: 62,
    level: 3,
    totalPoints: 920,
    badges: [
      {
        id: 'beginner',
        name: 'Green Beginner',
        description: 'Started sustainable farming journey',
        icon: '🌿',
        type: 'bronze',
        earnedAt: new Date('2024-03-01'),
      },
    ],
  },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: async (username: string, password: string) => {
    // Simple mock authentication
    const user = mockUsers.find(u => u.username === username);
    if (user && password === (username === 'admin' ? 'admin123' : 'demo123')) {
      set({ user, isLoggedIn: true });
      return user;
    }
    return null;
  },
  logout: () => {
    set({ user: null, isLoggedIn: false });
  },
}));