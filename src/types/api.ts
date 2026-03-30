// API Types based on backend OpenAPI schema

export type UserRole = 'applicant' | 'employer' | 'curator';

export type ApplicationStatus = 'pending' | 'viewed' | 'accepted' | 'rejected' | 'reserve' | 'withdrawn';

export type OpportunityType = 'vacancy' | 'internship' | 'mentoring' | 'event';

export type WorkFormat = 'office' | 'hybrid' | 'remote' | 'online';

export type ExperienceLevel = 'intern' | 'junior' | 'middle' | 'senior' | 'lead';

export type EmploymentType = 'full_time' | 'part_time' | 'project' | 'volunteer';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type OpportunityStatus = 'draft' | 'active' | 'paused' | 'closed' | 'planned';

export type ContactStatus = 'pending' | 'accepted' | 'rejected';

export type EventRegistrationStatus = 'confirmed' | 'waitlist';

// Base interfaces
export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  profile?: ProfileResponse;
}

export interface ProfileResponse {
  first_name: string;
  last_name: string;
  middle_name?: string;
  university?: string;
  graduation_year?: number;
  skills: string[];
  social_links: Record<string, string>;
  privacy_settings: Record<string, boolean>;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

// Company interfaces
export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  inn?: string;
  short_description?: string;
  description?: string;
  industry?: string;
  company_size?: string;
  city?: string;
  website_url?: string;
  logo_url?: string;
  verification_status: VerificationStatus;
  is_active: boolean;
  created_at: string;
}

export interface CompanyShort {
  id: string;
  name: string;
  logo_url?: string;
  city?: string;
  verification_status?: VerificationStatus;
}

export interface InnVerifyRequest {
  inn: string;
}

export interface InnVerifyResponse {
  inn: string;
  kpp?: string;
  ogrn?: string;
  full_name: string;
  short_name: string;
  legal_form?: string;
  is_individual: boolean;
  status: string;
  address?: string;
  city?: string;
  ceo_name?: string;
  ceo_post?: string;
  is_verified_by_dadata: boolean;
  session_token?: string;
}

export interface CompanyRegisterRequest {
  inn: string;
  session_token?: string;
  corporate_email: string;
  website_url?: string;
  description?: string;
  short_description?: string;
  industry?: string;
  company_size?: string;
  verification_links: Array<{ type: string; url: string }>;
}

export interface CompanyDocumentsRequest {
  verification_links?: Array<{ type: string; url: string }>;
  documents?: Array<{ type: string; url: string; name: string }>;
  description?: string;
  short_description?: string;
}

export interface CompanyVerificationStatusResponse {
  company_id: string;
  verification_status: VerificationStatus;
  inn?: string;
  inn_verified: boolean;
  email_domain_verified: boolean;
  curator_comment?: string;
  created_at: string;
}

export interface CompanyVerificationDetailResponse {
  company_id: string;
  company_name: string;
  legal_name?: string;
  inn?: string;
  inn_verified: boolean;
  ogrn?: string;
  owner_email: string;
  corporate_email?: string;
  email_domain_verified: boolean;
  website_url?: string;
  city?: string;
  industry?: string;
  company_size?: string;
  description?: string;
  verification_links: Array<{ type: string; url: string }>;
  documents: Array<{ type: string; url: string; name: string }>;
  verification_status: VerificationStatus;
  curator_comment?: string;
  submitted_at: string;
}

export interface CuratorReviewRequest {
  approve: boolean;
  comment?: string;
}

// Opportunity interfaces
export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  status: OpportunityStatus;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  work_format: WorkFormat;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  company: CompanyShort;
  location: LocationInfo;
  salary: SalaryInfo;
  skills: string[];
  tags: string[];
  contact_name?: string;
  contact_email?: string;
  contact_url?: string;
  published_at?: string;
  expires_at?: string;
  event_start_at?: string;
  event_end_at?: string;
  max_participants?: number;
  current_participants?: number;
  views_count: number;
  applications_count: number;
  favorites_count: number;
  is_favorited?: boolean;
  is_applied?: boolean;
}

export interface OpportunityListItem {
  id: string;
  type: OpportunityType;
  title: string;
  status: OpportunityStatus;
  work_format: WorkFormat;
  experience_level?: ExperienceLevel;
  employment_type?: EmploymentType;
  company: CompanyShort;
  location: LocationInfo;
  salary: SalaryInfo;
  tags: string[];
  published_at?: string;
  expires_at?: string;
  event_start_at?: string;
  event_end_at?: string;
  max_participants?: number;
  current_participants?: number;
  views_count: number;
  applications_count: number;
}

export interface OpportunityShort {
  id: string;
  type: OpportunityType;
  title: string;
  work_format: WorkFormat;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  city?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
}

export interface OpportunityEmployerDetail {
  id: string;
  type: OpportunityType;
  title: string;
  status: OpportunityStatus;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  work_format: WorkFormat;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_gross?: boolean;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  expires_at?: string;
  event_start_at?: string;
  event_end_at?: string;
  max_participants?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_url?: string;
  skill_ids: string[];
  tag_ids: string[];
  media: Array<{ type: string; url: string }>;
  stats: OpportunityOwnerStats;
  created_at: string;
  updated_at: string;
  published_at?: string;
  moderation_comment?: string;
}

export interface OpportunityEmployerItem {
  id: string;
  type: OpportunityType;
  title: string;
  status: OpportunityStatus;
  work_format: WorkFormat;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  location: LocationInfo;
  salary: SalaryInfo;
  tags: string[];
  created_at: string;
  published_at?: string;
  expires_at?: string;
  event_start_at?: string;
  event_end_at?: string;
  stats: OpportunityOwnerStats;
}

export interface OpportunityOwnerStats {
  views_count: number;
  applications_count: number;
  favorites_count: number;
  pending_applications: number;
  accepted_applications: number;
  rejected_applications: number;
}

export interface OpportunityCreate {
  type: OpportunityType;
  title: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  work_format: WorkFormat;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_gross?: boolean;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  expires_at?: string;
  event_start_at?: string;
  event_end_at?: string;
  max_participants?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_url?: string;
  skill_ids?: string[];
  tag_ids?: string[];
  media?: Array<{ type: string; url: string }>;
}

export interface OpportunityUpdate {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  work_format?: WorkFormat;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_gross?: boolean;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  expires_at?: string;
  event_start_at?: string;
  event_end_at?: string;
  max_participants?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_url?: string;
  skill_ids?: string[];
  tag_ids?: string[];
  media?: Array<{ type: string; url: string }>;
}

export interface OpportunityPublishRequest {
  curator_comment?: string;
}

export interface LocationInfo {
  lat?: number;
  lng?: number;
  address?: string;
  city?: string;
}

export interface SalaryInfo {
  min?: number;
  max?: number;
  currency: string;
  gross: boolean;
}

export interface OpportunityMapMarker {
  id: string;
  type: OpportunityType;
  lat: number;
  lng: number;
  title: string;
  company_name: string;
  company_logo_url?: string;
  salary_min?: number;
  salary_max?: number;
  work_format: WorkFormat;
  city?: string;
  is_favorite_company: boolean;
}

export interface OpportunityFiltersResponse {
  cities: CityOption[];
  types: FilterOption[];
  work_formats: FilterOption[];
  experience_levels: FilterOption[];
  employment_types: FilterOption[];
  salary_ranges: SalaryRange[];
  detected_city?: string;
}

export interface CityOption {
  name: string;
  count: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface SalaryRange {
  min?: number;
  max?: number;
  count: number;
}

// Application interfaces
export interface Application {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  cv_url_snapshot?: string;
  employer_comment?: string;
  employer_note?: string;
  status_history: StatusHistoryItem[];
  viewed_at?: string;
  responded_at?: string;
  is_shortlisted: boolean;
  created_at: string;
  updated_at: string;
  opportunity?: OpportunityShort;
  applicant_profile?: ApplicantProfileShort;
  company?: CompanyShort;
}

export interface ApplicationListItem {
  id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  cv_url_snapshot?: string;
  employer_comment?: string;
  is_shortlisted: boolean;
  created_at: string;
  viewed_at?: string;
  responded_at?: string;
  opportunity?: OpportunityShort;
  company?: CompanyShort;
}

export interface ApplicationEmployerListItem {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  is_shortlisted: boolean;
  created_at: string;
  viewed_at?: string;
  responded_at?: string;
  applicant_profile?: ApplicantProfileShort;
}

export interface ApplicationCreate {
  opportunity_id: string;
  cover_letter?: string;
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
  employer_comment?: string;
}

export interface ApplicationFeedbackUpdate {
  employer_comment?: string;
  employer_note?: string;
}

export interface StatusHistoryItem {
  status: string;
  changed_at: string;
  changed_by: string;
}

export interface ApplicantProfileShort {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  headline?: string;
  avatar_url?: string;
  university?: string;
  graduation_year?: number;
  cv_url?: string;
  privacy_settings?: Record<string, boolean>;
}

export interface ApplicantDetailResponse {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  university?: string;
  faculty?: string;
  specialization?: string;
  graduation_year?: number;
  study_year?: number;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  social_links: Record<string, string>;
  portfolio_url?: string;
  cv_url?: string;
  skills: string[];
  privacy_settings: Record<string, boolean>;
  career_preferences: Record<string, boolean>;
  show_full_data: boolean;
  is_contact: boolean;
}

export interface ApplicantSearchItem {
  id: string;
  first_name: string;
  last_name: string;
  university?: string;
  graduation_year?: number;
  skills: string[];
  avatar_url?: string;
  headline?: string;
  is_contact: boolean;
}

// Applicant interfaces
export interface ApplicantPublicProfile {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  university?: string;
  faculty?: string;
  specialization?: string;
  graduation_year?: number;
  study_year?: number;
  headline?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  social_links: Record<string, string>;
  portfolio_url?: string;
  cv_url?: string;
  skills: string[];
  privacy_settings: Record<string, boolean>;
  career_preferences: Record<string, boolean>;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  university?: string;
  graduation_year?: number;
  skills?: string[];
  social_links?: Record<string, string>;
  privacy_settings?: Record<string, boolean>;
}

export interface PasswordChangeRequest {
  old_password: string;
  new_password: string;
}

// Contact interfaces
export interface ContactRequest {
  message?: string;
}

export interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

// Favorite interfaces
export interface FavoriteOpportunityItem {
  id: string;
  opportunity: OpportunityListItem;
  note?: string;
  created_at: string;
}

export interface FavoriteCompanyItem {
  id: string;
  company: CompanyShort;
  created_at: string;
}

export interface FavoriteSyncRequest {
  opportunity_ids: string[];
  company_ids: string[];
}

export interface FavoriteSyncResponse {
  synced_opportunities: string[];
  synced_companies: string[];
}

// Event interfaces
export interface EventInfo {
  id: string;
  title: string;
  event_start_at?: string;
  event_end_at?: string;
  max_participants?: number;
  current_participants: number;
  available_spots?: number;
  user_registration_status?: EventRegistrationStatus;
}

export interface EventRegistrationResponse {
  id: string;
  status: EventRegistrationStatus;
  message: string;
  check_in_code?: string;
  event_id: string;
}

export interface EventRegistrationItem {
  id: string;
  profile: ApplicantProfileShort;
  status: EventRegistrationStatus;
  check_in_code?: string;
  checked_in_at?: string;
  registered_at: string;
}

export interface EventCheckInRequest {
  check_in_code: string;
}

export interface EventCheckInResponse {
  success: boolean;
  message: string;
  profile_id: string;
  checked_in_at: string;
}

// Moderation interfaces
export interface ModerationOpportunityItem {
  id: string;
  type: OpportunityType;
  title: string;
  status: OpportunityStatus;
  company: CompanyShort;
  published_at?: string;
  created_at: string;
  moderation_comment?: string;
}

export interface ModerationOpportunityDetail {
  id: string;
  type: OpportunityType;
  title: string;
  status: OpportunityStatus;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  work_format: WorkFormat;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  company: CompanyShort;
  location: LocationInfo;
  salary: SalaryInfo;
  skills: string[];
  tags: string[];
  contact_name?: string;
  contact_email?: string;
  contact_url?: string;
  published_at?: string;
  expires_at?: string;
  event_start_at?: string;
  event_end_at?: string;
  max_participants?: number;
  current_participants?: number;
  views_count: number;
  applications_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
  moderation_comment?: string;
}

export interface ModerationReviewRequest {
  approve: boolean;
  comment?: string;
}

export interface ModerationReviewResponse {
  id: string;
  status: OpportunityStatus;
  is_moderated: boolean;
  message: string;
  moderation_comment?: string;
}

// Skill & Tag interfaces
export interface SkillListItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon_url?: string;
  usage_count: number;
  is_system: boolean;
}

export interface SkillListResponse {
  items: SkillListItem[];
  total: number;
  limit: number;
  offset: number;
  categories: string[];
}

export interface TagListItem {
  id: string;
  name: string;
  slug: string;
  category?: string;
  color?: string;
  usage_count: number;
  is_system: boolean;
}

export interface TagListResponse {
  items: TagListItem[];
  total: number;
  limit: number;
  offset: number;
  categories: string[];
}

// Upload interfaces
export interface CVUploadResponse {
  url: string;
  filename: string;
  file_type: string;
  file_size: number;
}

export interface MediaUploadResponse {
  url: string;
  filename: string;
  file_type: string;
  file_size: number;
  media_type: string;
}

// Recommendation interfaces
export interface RecommendationProfileShort {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface RecommendationSentItem {
  id: string;
  recipient: RecommendationProfileShort;
  opportunity: OpportunityShort;
  message?: string;
  is_read: boolean;
  created_at: string;
}

export interface RecommendationReceivedItem {
  id: string;
  sender: RecommendationProfileShort;
  opportunity: OpportunityShort;
  message?: string;
  is_read: boolean;
  created_at: string;
}

export interface RecommendationCreateRequest {
  recipient_id: string;
  opportunity_id: string;
  message?: string;
}

// Pagination interfaces
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}
