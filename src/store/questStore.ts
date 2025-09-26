import { create } from 'zustand';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'soil' | 'water' | 'biodiversity' | 'organic' | 'climate';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  duration: number; // in days
  steps: QuestStep[];
  requirements: string[];
  status: 'available' | 'active' | 'completed' | 'pending_approval';
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // 0-100
  icon: string;
  farmerId?: string;
}

export interface QuestStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  evidence?: string; // URL or description of evidence
}

export interface CommunityPost {
  id: string;
  farmerId: string;
  farmerName: string;
  content: string;
  questId?: string;
  questTitle?: string;
  badges: string[];
  likes: number;
  createdAt: Date;
  hasLiked: boolean;
}

interface QuestState {
  quests: Quest[];
  communityPosts: CommunityPost[];
  startQuest: (questId: string, farmerId: string) => void;
  updateQuestProgress: (questId: string, stepId: string, evidence?: string) => void;
  completeQuest: (questId: string) => void;
  approveQuest: (questId: string) => void;
  addCommunityPost: (content: string, farmerId: string, farmerName: string, questId?: string, questTitle?: string) => void;
  likePost: (postId: string) => void;
  getActiveQuests: (farmerId: string) => Quest[];
  getAvailableQuests: (farmerId: string) => Quest[];
}

// Mock quest data
const initialQuests: Quest[] = [
  {
    id: 'bio-pesticide',
    title: 'Use Bio-Pesticides',
    description: 'Replace chemical pesticides with organic alternatives to protect beneficial insects and soil health.',
    category: 'organic',
    difficulty: 'medium',
    points: 250,
    duration: 14,
    icon: '🐛',
    status: 'available',
    progress: 0,
    requirements: ['Own farmland', 'Basic organic knowledge'],
    steps: [
      {
        id: 'research',
        title: 'Research Bio-Pesticides',
        description: 'Learn about different types of bio-pesticides suitable for your crops',
        completed: false,
      },
      {
        id: 'purchase',
        title: 'Purchase Organic Materials',
        description: 'Buy neem oil, beneficial bacteria, or prepare homemade solutions',
        completed: false,
      },
      {
        id: 'apply',
        title: 'Apply Bio-Pesticides',
        description: 'Apply the bio-pesticides following recommended guidelines',
        completed: false,
      },
      {
        id: 'monitor',
        title: 'Monitor Results',
        description: 'Track pest reduction and crop health over 2 weeks',
        completed: false,
      },
    ],
  },
  {
    id: 'mulching-banana',
    title: 'Mulching Banana Fields',
    description: 'Implement mulching techniques in banana cultivation to retain moisture and improve soil health.',
    category: 'soil',
    difficulty: 'easy',
    points: 150,
    duration: 7,
    icon: '🍌',
    status: 'available',
    progress: 0,
    requirements: ['Banana cultivation', 'Access to organic mulch materials'],
    steps: [
      {
        id: 'prepare',
        title: 'Prepare Mulch Material',
        description: 'Collect dried leaves, straw, or organic waste for mulching',
        completed: false,
      },
      {
        id: 'apply-mulch',
        title: 'Apply Mulch',
        description: 'Spread mulch around banana plants, maintaining proper thickness',
        completed: false,
      },
      {
        id: 'maintenance',
        title: 'Regular Maintenance',
        description: 'Monitor and replenish mulch as needed',
        completed: false,
      },
    ],
  },
  {
    id: 'mixed-cropping',
    title: 'Mixed Cropping System',
    description: 'Implement companion planting to improve biodiversity and reduce pest problems.',
    category: 'biodiversity',
    difficulty: 'hard',
    points: 400,
    duration: 30,
    icon: '🌾',
    status: 'available',
    progress: 0,
    requirements: ['Multiple crop varieties', 'Planning expertise'],
    steps: [
      {
        id: 'plan',
        title: 'Plan Crop Combinations',
        description: 'Design a mixed cropping layout with compatible plants',
        completed: false,
      },
      {
        id: 'plant',
        title: 'Plant Mixed Crops',
        description: 'Plant different crops according to the planned design',
        completed: false,
      },
      {
        id: 'manage',
        title: 'Manage Growth',
        description: 'Monitor and manage the mixed cropping system',
        completed: false,
      },
      {
        id: 'evaluate',
        title: 'Evaluate Results',
        description: 'Assess yield, pest reduction, and soil health improvements',
        completed: false,
      },
    ],
  },
  {
    id: 'soil-health',
    title: 'Soil Health Check',
    description: 'Conduct comprehensive soil testing and implement improvement measures.',
    category: 'soil',
    difficulty: 'medium',
    points: 200,
    duration: 21,
    icon: '🧪',
    status: 'available',
    progress: 0,
    requirements: ['Soil testing kit or lab access'],
    steps: [
      {
        id: 'collect',
        title: 'Collect Soil Samples',
        description: 'Gather soil samples from different areas of your farm',
        completed: false,
      },
      {
        id: 'test',
        title: 'Test Soil Properties',
        description: 'Analyze pH, nutrients, and organic matter content',
        completed: false,
      },
      {
        id: 'implement',
        title: 'Implement Improvements',
        description: 'Apply recommended amendments based on test results',
        completed: false,
      },
    ],
  },
  {
    id: 'water-conservation',
    title: 'Water Conservation Techniques',
    description: 'Install drip irrigation or rainwater harvesting system to conserve water.',
    category: 'water',
    difficulty: 'hard',
    points: 350,
    duration: 28,
    icon: '💧',
    status: 'available',
    progress: 0,
    requirements: ['Investment budget', 'Technical support'],
    steps: [
      {
        id: 'assess',
        title: 'Assess Water Needs',
        description: 'Calculate water requirements for your crops',
        completed: false,
      },
      {
        id: 'install',
        title: 'Install System',
        description: 'Set up drip irrigation or rainwater harvesting',
        completed: false,
      },
      {
        id: 'optimize',
        title: 'Optimize Usage',
        description: 'Fine-tune the system for maximum efficiency',
        completed: false,
      },
    ],
  },
];

const initialPosts: CommunityPost[] = [
  {
    id: '1',
    farmerId: 'farmer1',
    farmerName: 'Ravi Kumar',
    content: 'Just completed my mulching quest! 🌱 The banana plants are looking much healthier and the soil stays moist longer. Highly recommend this technique!',
    questId: 'mulching-banana',
    questTitle: 'Mulching Banana Fields',
    badges: ['🌱', '💧'],
    likes: 12,
    createdAt: new Date('2024-01-20'),
    hasLiked: false,
  },
  {
    id: '2',
    farmerId: 'farmer2',
    farmerName: 'Priya Nair',
    content: 'Excited to start the bio-pesticide quest tomorrow! Has anyone tried neem oil for coconut trees? Looking for tips! 🥥',
    badges: ['🏆'],
    likes: 8,
    createdAt: new Date('2024-01-21'),
    hasLiked: true,
  },
  {
    id: '3',
    farmerId: 'farmer3',
    farmerName: 'Suresh Menon',
    content: 'My first week with the soil health check quest. The pH results were surprising! Learning so much about my farm. 🧪',
    questId: 'soil-health',
    questTitle: 'Soil Health Check',
    badges: ['🌿'],
    likes: 15,
    createdAt: new Date('2024-01-22'),
    hasLiked: false,
  },
];

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: initialQuests,
  communityPosts: initialPosts,
  
  startQuest: (questId: string, farmerId: string) => {
    set((state) => ({
      quests: state.quests.map((quest) =>
        quest.id === questId
          ? { ...quest, status: 'active', farmerId, startedAt: new Date() }
          : quest
      ),
    }));
  },

  updateQuestProgress: (questId: string, stepId: string, evidence?: string) => {
    set((state) => ({
      quests: state.quests.map((quest) => {
        if (quest.id === questId) {
          const updatedSteps = quest.steps.map((step) =>
            step.id === stepId
              ? { ...step, completed: true, evidence }
              : step
          );
          const completedSteps = updatedSteps.filter(step => step.completed).length;
          const progress = Math.round((completedSteps / updatedSteps.length) * 100);
          const status = progress === 100 ? 'pending_approval' : 'active';
          
          return { ...quest, steps: updatedSteps, progress, status };
        }
        return quest;
      }),
    }));
  },

  completeQuest: (questId: string) => {
    set((state) => ({
      quests: state.quests.map((quest) =>
        quest.id === questId
          ? { ...quest, status: 'completed', completedAt: new Date(), progress: 100 }
          : quest
      ),
    }));
  },

  approveQuest: (questId: string) => {
    const { completeQuest } = get();
    completeQuest(questId);
  },

  addCommunityPost: (content: string, farmerId: string, farmerName: string, questId?: string, questTitle?: string) => {
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      farmerId,
      farmerName,
      content,
      questId,
      questTitle,
      badges: ['🌱'], // Default badge
      likes: 0,
      createdAt: new Date(),
      hasLiked: false,
    };
    
    set((state) => ({
      communityPosts: [newPost, ...state.communityPosts],
    }));
  },

  likePost: (postId: string) => {
    set((state) => ({
      communityPosts: state.communityPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.hasLiked ? post.likes - 1 : post.likes + 1, hasLiked: !post.hasLiked }
          : post
      ),
    }));
  },

  getActiveQuests: (farmerId: string) => {
    return get().quests.filter(quest => quest.farmerId === farmerId && (quest.status === 'active' || quest.status === 'pending_approval'));
  },

  getAvailableQuests: (farmerId: string) => {
    return get().quests.filter(quest => quest.status === 'available');
  },
}));