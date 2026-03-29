// Curator Store - manages curator-specific state
import { create } from 'zustand';
import {
  companiesApi,
  opportunitiesApi,
  usersApi,
  applicantsApi,
} from '@/api/apiClient';
import type {
  CompanyVerificationDetailResponse,
  ModerationOpportunityItem,
  ModerationOpportunityDetail,
  User,
  ApplicantDetailResponse,
  ApplicantSearchItem,
} from '@/types/api';

interface CuratorState {
  // Companies for verification
  pendingCompanies: CompanyVerificationDetailResponse[];
  companiesTotal: number;
  companiesLoading: boolean;
  
  // Opportunities for moderation
  pendingOpportunities: ModerationOpportunityItem[];
  opportunitiesTotal: number;
  opportunitiesLoading: boolean;
  currentModerationOpportunity: ModerationOpportunityDetail | null;
  
  // User management
  usersLoading: boolean;
  
  // Applicants search
  searchResults: ApplicantSearchItem[];
  searchTotal: number;
  searchLoading: boolean;
  
  // Actions - Companies
  fetchPendingCompanies: (limit?: number, offset?: number) => Promise<void>;
  reviewCompany: (companyId: string, approve: boolean, comment?: string) => Promise<void>;
  
  // Actions - Opportunities
  fetchPendingOpportunities: (limit?: number, offset?: number) => Promise<void>;
  getModerationOpportunityDetail: (opportunityId: string) => Promise<void>;
  reviewOpportunity: (opportunityId: string, approve: boolean, comment?: string) => Promise<void>;
  
  // Actions - Users
  createCurator: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<User>;
  verifyEmployer: (employerId: string, isVerified: boolean) => Promise<void>;
  
  // Actions - Applicants
  searchApplicants: (params: {
    skills?: string;
    university?: string;
    graduation_year?: number;
    city?: string;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
  getApplicantProfile: (profileId: string) => Promise<ApplicantDetailResponse>;
  
  // Profile actions
  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    university?: string;
    graduation_year?: number;
    skills?: string[];
    social_links?: Record<string, string>;
    privacy_settings?: Record<string, boolean>;
  }) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useCuratorStore = create<CuratorState>((set, get) => ({
  // Initial state
  pendingCompanies: [],
  companiesTotal: 0,
  companiesLoading: false,
  
  pendingOpportunities: [],
  opportunitiesTotal: 0,
  opportunitiesLoading: false,
  currentModerationOpportunity: null,
  
  usersLoading: false,
  
  searchResults: [],
  searchTotal: 0,
  searchLoading: false,
  
  // Companies actions
  fetchPendingCompanies: async (limit = 50, offset = 0) => {
    set({ companiesLoading: true });
    try {
      const data = await companiesApi.getPendingCompanies(limit, offset) as CompanyVerificationDetailResponse[];
      set({
        pendingCompanies: data || [],
        companiesTotal: data?.length || 0,
        companiesLoading: false,
      });
    } catch (error) {
      set({ companiesLoading: false });
      console.error('Failed to fetch pending companies:', error);
    }
  },
  
  reviewCompany: async (companyId: string, approve: boolean, comment?: string) => {
    await companiesApi.reviewCompany(companyId, { approve, comment });
    // Refresh the list
    await get().fetchPendingCompanies();
  },
  
  // Opportunities actions
  fetchPendingOpportunities: async (limit = 50, offset = 0) => {
    set({ opportunitiesLoading: true });
    try {
      const data = await opportunitiesApi.getPendingModeration(limit, offset) as { items: ModerationOpportunityItem[]; total: number };
      set({
        pendingOpportunities: data.items || [],
        opportunitiesTotal: data.total || 0,
        opportunitiesLoading: false,
      });
    } catch (error) {
      set({ opportunitiesLoading: false });
      console.error('Failed to fetch pending opportunities:', error);
    }
  },
  
  getModerationOpportunityDetail: async (opportunityId: string) => {
    set({ currentModerationOpportunity: null });
    try {
      const data = await opportunitiesApi.getModerationDetail(opportunityId) as ModerationOpportunityDetail;
      set({ currentModerationOpportunity: data });
    } catch (error) {
      console.error('Failed to fetch moderation opportunity detail:', error);
    }
  },
  
  reviewOpportunity: async (opportunityId: string, approve: boolean, comment?: string) => {
    await opportunitiesApi.reviewOpportunity(opportunityId, { approve, comment });
    // Refresh the list
    await get().fetchPendingOpportunities();
  },
  
  // Users actions
  createCurator: async (data) => {
    return await usersApi.createCurator(data) as User;
  },
  
  verifyEmployer: async (employerId: string, isVerified: boolean) => {
    await usersApi.verifyEmployer(employerId, isVerified);
  },
  
  // Applicants search actions
  searchApplicants: async (params) => {
    set({ searchLoading: true });
    try {
      const data = await applicantsApi.search(params) as { items: ApplicantSearchItem[]; total: number };
      set({
        searchResults: data.items || [],
        searchTotal: data.total || 0,
        searchLoading: false,
      });
    } catch (error) {
      set({ searchLoading: false });
      console.error('Failed to search applicants:', error);
    }
  },
  
  getApplicantProfile: async (profileId: string) => {
    return await applicantsApi.getProfile(profileId) as ApplicantDetailResponse;
  },
  
  // Profile actions
  updateProfile: async (data) => {
    await usersApi.updateMe(data);
  },
  
  changePassword: async (oldPassword: string, newPassword: string) => {
    await usersApi.changePassword(oldPassword, newPassword);
  },
}));
