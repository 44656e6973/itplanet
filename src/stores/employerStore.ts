// Employer Store - manages employer-specific state
import { create } from 'zustand';
import {
  opportunitiesApi,
  applicationsApi,
  companiesApi,
  applicantsApi,
  eventsApi,
  usersApi,
} from '@/api/apiClient';
import type {
  OpportunityEmployerDetail,
  OpportunityEmployerItem,
  OpportunityCreate,
  OpportunityUpdate,
  Application,
  ApplicationEmployerListItem,
  Company,
  CompanyVerificationStatusResponse,
  ApplicantDetailResponse,
  ApplicantSearchItem,
  EventRegistrationItem,
  UserUpdate,
} from '@/types/api';

interface EmployerState {
  // Company
  company: Company | null;
  verificationStatus: CompanyVerificationStatusResponse | null;
  companyLoading: boolean;
  
  // Opportunities
  opportunities: OpportunityEmployerItem[];
  opportunitiesTotal: number;
  opportunitiesLoading: boolean;
  currentOpportunity: OpportunityEmployerDetail | null;
  
  // Applications
  applications: ApplicationEmployerListItem[];
  applicationsTotal: number;
  applicationsLoading: boolean;
  currentApplication: Application | null;
  
  // Applicants search
  searchResults: ApplicantSearchItem[];
  searchTotal: number;
  searchLoading: boolean;
  
  // Event participants
  participants: EventRegistrationItem[];
  participantsTotal: number;
  participantsLoading: boolean;
  
  // Actions - Company
  fetchVerificationStatus: () => Promise<void>;
  verifyInn: (inn: string) => Promise<unknown>;
  registerCompany: (data: {
    inn: string;
    session_token?: string;
    corporate_email: string;
    website_url?: string;
    description?: string;
    short_description?: string;
    industry?: string;
    company_size?: string;
    verification_links: Array<{ type: string; url: string }>;
  }) => Promise<Company>;
  submitCompanyDocuments: (data: {
    verification_links?: Array<{ type: string; url: string }>;
    documents?: Array<{ type: string; url: string; name: string }>;
    description?: string;
    short_description?: string;
  }) => Promise<void>;
  
  // Actions - Opportunities
  fetchOpportunities: (limit?: number, offset?: number) => Promise<void>;
  createOpportunity: (data: OpportunityCreate) => Promise<OpportunityEmployerDetail>;
  updateOpportunity: (opportunityId: string, data: OpportunityUpdate) => Promise<OpportunityEmployerDetail>;
  deleteOpportunity: (opportunityId: string) => Promise<void>;
  publishOpportunity: (opportunityId: string, curatorComment?: string) => Promise<void>;
  getOpportunityDetail: (opportunityId: string) => Promise<void>;
  
  // Actions - Applications
  fetchOpportunityApplications: (opportunityId: string, limit?: number, offset?: number) => Promise<void>;
  getApplicationDetail: (applicationId: string) => Promise<Application>;
  updateApplicationStatus: (
    applicationId: string,
    status: 'pending' | 'viewed' | 'accepted' | 'rejected' | 'reserve',
    employerComment?: string
  ) => Promise<void>;
  updateApplicationFeedback: (
    applicationId: string,
    employerComment?: string,
    employerNote?: string
  ) => Promise<void>;
  
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
  sendContactRequest: (profileId: string, message?: string) => Promise<void>;
  
  // Actions - Events
  getEventParticipants: (opportunityId: string, limit?: number, offset?: number) => Promise<void>;
  checkInParticipant: (opportunityId: string, checkInCode: string) => Promise<void>;
  
  // Actions - Profile
  updateProfile: (data: UserUpdate) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useEmployerStore = create<EmployerState>((set, get) => ({
  // Initial state
  company: null,
  verificationStatus: null,
  companyLoading: false,
  
  opportunities: [],
  opportunitiesTotal: 0,
  opportunitiesLoading: false,
  currentOpportunity: null,
  
  applications: [],
  applicationsTotal: 0,
  applicationsLoading: false,
  currentApplication: null,
  
  searchResults: [],
  searchTotal: 0,
  searchLoading: false,
  
  participants: [],
  participantsTotal: 0,
  participantsLoading: false,
  
  // Company actions
  fetchVerificationStatus: async () => {
    set({ companyLoading: true });
    try {
      const data = await companiesApi.getVerificationStatus() as CompanyVerificationStatusResponse;
      set({ verificationStatus: data, companyLoading: false });
    } catch (error) {
      set({ companyLoading: false });
      console.error('Failed to fetch verification status:', error);
    }
  },
  
  verifyInn: async (inn: string) => {
    return await companiesApi.verifyInn(inn);
  },
  
  registerCompany: async (data) => {
    return await companiesApi.register(data) as Company;
  },
  
  submitCompanyDocuments: async (data) => {
    await companiesApi.submitDocuments(data);
    await get().fetchVerificationStatus();
  },
  
  // Opportunities actions
  fetchOpportunities: async (limit = 50, offset = 0) => {
    set({ opportunitiesLoading: true });
    try {
      const data = await opportunitiesApi.getMyOpportunities(limit, offset) as { items: OpportunityEmployerItem[]; total: number };
      set({
        opportunities: data.items || [],
        opportunitiesTotal: data.total || 0,
        opportunitiesLoading: false,
      });
    } catch (error) {
      set({ opportunitiesLoading: false });
      console.error('Failed to fetch opportunities:', error);
    }
  },
  
  createOpportunity: async (data: OpportunityCreate) => {
    return await opportunitiesApi.create(data) as OpportunityEmployerDetail;
  },
  
  updateOpportunity: async (opportunityId: string, data: OpportunityUpdate) => {
    return await opportunitiesApi.update(opportunityId, data as Record<string, unknown>) as OpportunityEmployerDetail;
  },
  
  deleteOpportunity: async (opportunityId: string) => {
    await opportunitiesApi.delete(opportunityId);
    await get().fetchOpportunities();
  },
  
  publishOpportunity: async (opportunityId: string, curatorComment?: string) => {
    await opportunitiesApi.publish(opportunityId, curatorComment);
    await get().fetchOpportunities();
  },
  
  getOpportunityDetail: async (opportunityId: string) => {
    set({ currentOpportunity: null });
    try {
      const data = await opportunitiesApi.getEmployerDetail(opportunityId) as OpportunityEmployerDetail;
      set({ currentOpportunity: data });
    } catch (error) {
      console.error('Failed to fetch opportunity detail:', error);
    }
  },
  
  // Applications actions
  fetchOpportunityApplications: async (opportunityId: string, limit = 50, offset = 0) => {
    set({ applicationsLoading: true });
    try {
      const data = await applicationsApi.getOpportunityApplications(opportunityId, limit, offset) as { items: ApplicationEmployerListItem[]; total: number };
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
  
  getApplicationDetail: async (applicationId: string) => {
    try {
      const data = await applicationsApi.getEmployerDetail(applicationId) as Application;
      set({ currentApplication: data });
      return data;
    } catch (error) {
      console.error('Failed to fetch application detail:', error);
      throw error;
    }
  },
  
  updateApplicationStatus: async (
    applicationId: string,
    status: 'pending' | 'viewed' | 'accepted' | 'rejected' | 'reserve',
    employerComment?: string
  ) => {
    await applicationsApi.updateStatus(applicationId, { status, employer_comment: employerComment });
    // Refresh applications if we're viewing a specific opportunity's applications
    const { applications } = get();
    if (applications.length > 0) {
      const opportunityId = applications[0].opportunity_id;
      await get().fetchOpportunityApplications(opportunityId);
    }
  },
  
  updateApplicationFeedback: async (
    applicationId: string,
    employerComment?: string,
    employerNote?: string
  ) => {
    await applicationsApi.updateFeedback(applicationId, { employer_comment: employerComment, employer_note: employerNote });
    await get().getApplicationDetail(applicationId);
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
  
  sendContactRequest: async (profileId: string, message?: string) => {
    await applicantsApi.sendContactRequest(profileId, message);
  },
  
  // Events actions
  getEventParticipants: async (opportunityId: string, limit = 100, offset = 0) => {
    set({ participantsLoading: true });
    try {
      const data = await eventsApi.getParticipants(opportunityId, limit, offset) as { items: EventRegistrationItem[]; total: number };
      set({
        participants: data.items || [],
        participantsTotal: data.total || 0,
        participantsLoading: false,
      });
    } catch (error) {
      set({ participantsLoading: false });
      console.error('Failed to fetch participants:', error);
    }
  },
  
  checkInParticipant: async (opportunityId: string, checkInCode: string) => {
    await eventsApi.checkIn(opportunityId, checkInCode);
    await get().getEventParticipants(opportunityId);
  },
  
  // Profile actions
  updateProfile: async (data: UserUpdate) => {
    await usersApi.updateMe(data);
  },
  
  changePassword: async (oldPassword: string, newPassword: string) => {
    await usersApi.changePassword(oldPassword, newPassword);
  },
}));
