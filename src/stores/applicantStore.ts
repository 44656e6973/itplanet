// Applicant Store - manages applicant-specific state
import { create } from 'zustand';
import { 
  applicationsApi, 
  favoritesApi, 
  usersApi, 
  uploadsApi,
  recommendationsApi,
  eventsApi,
} from '@/api/apiClient';
import type {
  Application,
  ApplicationListItem,
  ApplicationCreate,
  FavoriteOpportunityItem,
  FavoriteCompanyItem,
  RecommendationSentItem,
  RecommendationReceivedItem,
  UserUpdate,
  CVUploadResponse,
} from '@/types/api';

interface ApplicantState {
  // Applications
  applications: ApplicationListItem[];
  applicationsTotal: number;
  applicationsLoading: boolean;
  
  // Favorites
  favoriteOpportunities: FavoriteOpportunityItem[];
  favoriteCompanies: FavoriteCompanyItem[];
  favoritesLoading: boolean;
  
  // Recommendations
  sentRecommendations: RecommendationSentItem[];
  receivedRecommendations: RecommendationReceivedItem[];
  recommendationsLoading: boolean;
  
  // Profile
  profileLoading: boolean;
  profileError: string | null;
  
  // Actions - Applications
  fetchApplications: (limit?: number, offset?: number) => Promise<void>;
  applyToOpportunity: (data: ApplicationCreate) => Promise<Application>;
  getApplicationDetail: (applicationId: string) => Promise<Application>;
  withdrawApplication: (applicationId: string) => Promise<void>;
  
  // Actions - Favorites
  fetchFavoriteOpportunities: () => Promise<void>;
  fetchFavoriteCompanies: () => Promise<void>;
  addToFavorites: (opportunityId: string, note?: string) => Promise<void>;
  removeFromFavorites: (opportunityId: string) => Promise<void>;
  addCompanyToFavorites: (companyId: string) => Promise<void>;
  removeCompanyFromFavorites: (companyId: string) => Promise<void>;
  syncFavorites: (opportunityIds: string[], companyIds: string[]) => Promise<void>;
  
  // Actions - Recommendations
  fetchSentRecommendations: (limit?: number, offset?: number) => Promise<void>;
  fetchReceivedRecommendations: (limit?: number, offset?: number) => Promise<void>;
  sendRecommendation: (recipientId: string, opportunityId: string, message?: string) => Promise<void>;
  markRecommendationAsRead: (recommendationId: string) => Promise<void>;
  
  // Actions - Profile
  updateProfile: (data: UserUpdate) => Promise<void>;
  uploadCv: (file: File) => Promise<string>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // Actions - Events
  registerForEvent: (opportunityId: string) => Promise<void>;
  cancelEventRegistration: (opportunityId: string) => Promise<void>;
}

export const useApplicantStore = create<ApplicantState>((set, get) => ({
  // Initial state
  applications: [],
  applicationsTotal: 0,
  applicationsLoading: false,
  
  favoriteOpportunities: [],
  favoriteCompanies: [],
  favoritesLoading: false,
  
  sentRecommendations: [],
  receivedRecommendations: [],
  recommendationsLoading: false,
  
  profileLoading: false,
  profileError: null,
  
  // Applications actions
  fetchApplications: async (limit = 50, offset = 0) => {
    set({ applicationsLoading: true });
    try {
      const data = await applicationsApi.getMyApplications(limit, offset) as { items: ApplicationListItem[]; total: number };
      set({
        applications: data.items || [],
        applicationsTotal: data.total || 0,
        applicationsLoading: false,
      });
    } catch (error) {
      set({ applicationsLoading: false });
      console.error('Failed to fetch applications:', error);
    }
  },
  
  applyToOpportunity: async (data: ApplicationCreate) => {
    return await applicationsApi.create(data) as Application;
  },
  
  getApplicationDetail: async (applicationId: string) => {
    return await applicationsApi.getMyApplicationDetail(applicationId) as Application;
  },
  
  withdrawApplication: async (applicationId: string) => {
    await applicationsApi.withdraw(applicationId);
    // Refresh applications list
    await get().fetchApplications();
  },
  
  // Favorites actions
  fetchFavoriteOpportunities: async () => {
    set({ favoritesLoading: true });
    try {
      const data = await favoritesApi.getFavoriteOpportunities() as { items: FavoriteOpportunityItem[] };
      set({
        favoriteOpportunities: data.items || [],
        favoritesLoading: false,
      });
    } catch (error) {
      set({ favoritesLoading: false });
      console.error('Failed to fetch favorite opportunities:', error);
    }
  },
  
  fetchFavoriteCompanies: async () => {
    set({ favoritesLoading: true });
    try {
      const data = await favoritesApi.getFavoriteCompanies() as { items: FavoriteCompanyItem[] };
      set({
        favoriteCompanies: data.items || [],
        favoritesLoading: false,
      });
    } catch (error) {
      set({ favoritesLoading: false });
      console.error('Failed to fetch favorite companies:', error);
    }
  },
  
  addToFavorites: async (opportunityId: string, note?: string) => {
    await favoritesApi.addOpportunity(opportunityId, note);
    await get().fetchFavoriteOpportunities();
  },
  
  removeFromFavorites: async (opportunityId: string) => {
    await favoritesApi.removeOpportunity(opportunityId);
    await get().fetchFavoriteOpportunities();
  },
  
  addCompanyToFavorites: async (companyId: string) => {
    await favoritesApi.addCompany(companyId);
    await get().fetchFavoriteCompanies();
  },
  
  removeCompanyFromFavorites: async (companyId: string) => {
    await favoritesApi.removeCompany(companyId);
    await get().fetchFavoriteCompanies();
  },
  
  syncFavorites: async (opportunityIds: string[], companyIds: string[]) => {
    await favoritesApi.sync({ opportunity_ids: opportunityIds, company_ids: companyIds });
  },
  
  // Recommendations actions
  fetchSentRecommendations: async (limit = 50, offset = 0) => {
    set({ recommendationsLoading: true });
    try {
      const data = await recommendationsApi.getSent(limit, offset) as { items: RecommendationSentItem[]; total: number };
      set({
        sentRecommendations: data.items || [],
        recommendationsLoading: false,
      });
    } catch (error) {
      set({ recommendationsLoading: false });
      console.error('Failed to fetch sent recommendations:', error);
    }
  },
  
  fetchReceivedRecommendations: async (limit = 50, offset = 0) => {
    set({ recommendationsLoading: true });
    try {
      const data = await recommendationsApi.getReceived(limit, offset) as { items: RecommendationReceivedItem[]; total: number };
      set({
        receivedRecommendations: data.items || [],
        recommendationsLoading: false,
      });
    } catch (error) {
      set({ recommendationsLoading: false });
      console.error('Failed to fetch received recommendations:', error);
    }
  },
  
  sendRecommendation: async (recipientId: string, opportunityId: string, message?: string) => {
    await recommendationsApi.create({ recipient_id: recipientId, opportunity_id: opportunityId, message });
    await get().fetchSentRecommendations();
  },
  
  markRecommendationAsRead: async (recommendationId: string) => {
    await recommendationsApi.markAsRead(recommendationId);
    await get().fetchReceivedRecommendations();
  },
  
  // Profile actions
  updateProfile: async (data: UserUpdate) => {
    set({ profileLoading: true, profileError: null });
    try {
      await usersApi.updateMe(data);
      set({ profileLoading: false });
    } catch (error) {
      set({ 
        profileLoading: false, 
        profileError: error instanceof Error ? error.message : 'Failed to update profile' 
      });
      throw error;
    }
  },
  
  uploadCv: async (file: File) => {
    const response = await uploadsApi.uploadCv(file) as CVUploadResponse;
    return response.url;
  },
  
  changePassword: async (oldPassword: string, newPassword: string) => {
    await usersApi.changePassword(oldPassword, newPassword);
  },
  
  // Events actions
  registerForEvent: async (opportunityId: string) => {
    await eventsApi.register(opportunityId);
  },
  
  cancelEventRegistration: async (opportunityId: string) => {
    await eventsApi.cancelRegistration(opportunityId);
  },
}));
