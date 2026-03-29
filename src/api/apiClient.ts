// API Client configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper functions for API calls
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  return handleResponse<T>(response);
}

async function requestWithFile<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  return handleResponse<T>(response);
}

// Auth API
export const authApi = {
  login: (username: string, password: string) => {
    const body = new URLSearchParams({ username, password });
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    }).then(handleResponse);
  },
  
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
  }) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  logout: () => request('/auth/logout', {
    method: 'POST',
  }),
  
  refreshToken: (refreshToken: string) => request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  }),
  
  requestPasswordReset: (email: string) => request('/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  confirmPasswordReset: (token: string, newPassword: string) => 
    request('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    }),
};

// Users API
export const usersApi = {
  me: () => request('/users/me'),
  
  updateMe: (data: {
    first_name?: string;
    last_name?: string;
    university?: string;
    graduation_year?: number;
    skills?: string[];
    social_links?: Record<string, string>;
    privacy_settings?: Record<string, boolean>;
  }) => request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  changePassword: (oldPassword: string, newPassword: string) => 
    request('/users/me/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    }),
  
  getPublicProfile: (userId: string) => request(`/users/${userId}`),
  
  searchApplicants: (params: {
    skills?: string;
    university?: string;
    graduation_year?: number;
    city?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.university) queryParams.append('university', params.university);
    if (params.graduation_year) queryParams.append('graduation_year', String(params.graduation_year));
    if (params.city) queryParams.append('city', params.city);
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));
    
    return request(`/users/applicants/search?${queryParams}`);
  },
  
  createCurator: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => request('/users/curators', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  verifyEmployer: (employerId: string, isVerified: boolean) => 
    request(`/users/employers/${employerId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ is_verified: isVerified }),
    }),
};

// Companies API
export const companiesApi = {
  verifyInn: (inn: string) => request('/companies/verify-inn', {
    method: 'POST',
    body: JSON.stringify({ inn }),
  }),
  
  register: (data: {
    inn: string;
    session_token?: string;
    corporate_email: string;
    website_url?: string;
    description?: string;
    short_description?: string;
    industry?: string;
    company_size?: string;
    verification_links: Array<{ type: string; url: string }>;
  }) => request('/companies/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  submitDocuments: (data: {
    verification_links?: Array<{ type: string; url: string }>;
    documents?: Array<{ type: string; url: string; name: string }>;
    description?: string;
    short_description?: string;
  }) => request('/companies/me/documents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getVerificationStatus: () => request('/companies/me/verification'),
  
  getPendingCompanies: (limit = 50, offset = 0) => 
    request(`/companies/pending?limit=${limit}&offset=${offset}`),
  
  reviewCompany: (companyId: string, data: { approve: boolean; comment?: string }) => 
    request(`/companies/${companyId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Opportunities API
export const opportunitiesApi = {
  getList: (params?: {
    city?: string;
    type?: string;
    work_format?: string;
    experience_level?: string;
    employment_type?: string;
    salary_min?: number;
    salary_max?: number;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.city) queryParams.append('city', params.city);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.work_format) queryParams.append('work_format', params.work_format);
    if (params?.experience_level) queryParams.append('experience_level', params.experience_level);
    if (params?.employment_type) queryParams.append('employment_type', params.employment_type);
    if (params?.salary_min) queryParams.append('salary_min', String(params.salary_min));
    if (params?.salary_max) queryParams.append('salary_max', String(params.salary_max));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    return request(`/opportunities?${queryParams}`);
  },
  
  getMapMarkers: (params?: {
    city?: string;
    type?: string;
    work_format?: string;
    experience_level?: string;
    employment_type?: string;
    salary_min?: number;
    salary_max?: number;
    sw_lat?: number;
    sw_lng?: number;
    ne_lat?: number;
    ne_lng?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.city) queryParams.append('city', params.city);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.work_format) queryParams.append('work_format', params.work_format);
    if (params?.experience_level) queryParams.append('experience_level', params.experience_level);
    if (params?.employment_type) queryParams.append('employment_type', params.employment_type);
    if (params?.salary_min) queryParams.append('salary_min', String(params.salary_min));
    if (params?.salary_max) queryParams.append('salary_max', String(params.salary_max));
    if (params?.sw_lat) queryParams.append('sw_lat', String(params.sw_lat));
    if (params?.sw_lng) queryParams.append('sw_lng', String(params.sw_lng));
    if (params?.ne_lat) queryParams.append('ne_lat', String(params.ne_lat));
    if (params?.ne_lng) queryParams.append('ne_lng', String(params.ne_lng));
    
    return request(`/opportunities/map?${queryParams}`);
  },
  
  getFilters: (city?: string) => 
    request(`/opportunities/filters${city ? `?city=${city}` : ''}`),
  
  getById: (opportunityId: string) => request(`/opportunities/${opportunityId}`),
  
  getEmployerDetail: (opportunityId: string) => 
    request(`/opportunities/${opportunityId}`),
  
  create: (data: {
    type: string;
    title: string;
    description?: string;
    requirements?: string;
    responsibilities?: string;
    work_format: string;
    employment_type?: string;
    experience_level?: string;
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
  }) => request('/opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (opportunityId: string, data: Record<string, unknown>) => 
    request(`/opportunities/${opportunityId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (opportunityId: string) => request(`/opportunities/${opportunityId}`, {
    method: 'DELETE',
  }),
  
  publish: (opportunityId: string, curatorComment?: string) => 
    request(`/opportunities/${opportunityId}/publish`, {
      method: 'POST',
      body: JSON.stringify(curatorComment ? { curator_comment: curatorComment } : undefined),
    }),
  
  getMyOpportunities: (limit = 50, offset = 0) => 
    request(`/opportunities/me?limit=${limit}&offset=${offset}`),
  
  // Moderation endpoints
  getPendingModeration: (limit = 50, offset = 0) => 
    request(`/opportunities/moderation/pending?limit=${limit}&offset=${offset}`),
  
  getModerationDetail: (opportunityId: string) => 
    request(`/opportunities/moderation/${opportunityId}`),
  
  reviewOpportunity: (opportunityId: string, data: { approve: boolean; comment?: string }) => 
    request(`/opportunities/moderation/${opportunityId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Applications API
export const applicationsApi = {
  create: (data: { opportunity_id: string; cover_letter?: string }) => 
    request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getMyApplications: (limit = 50, offset = 0) => 
    request(`/applications/me?limit=${limit}&offset=${offset}`),
  
  getMyApplicationDetail: (applicationId: string) => 
    request(`/applications/me/${applicationId}`),
  
  withdraw: (applicationId: string) => 
    request(`/applications/me/${applicationId}`, {
      method: 'DELETE',
    }),
  
  getOpportunityApplications: (opportunityId: string, limit = 50, offset = 0) => 
    request(`/opportunities/${opportunityId}/applications?limit=${limit}&offset=${offset}`),
  
  getEmployerDetail: (applicationId: string) => 
    request(`/applications/${applicationId}`),
  
  updateStatus: (applicationId: string, data: { status: string; employer_comment?: string }) => 
    request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  updateFeedback: (applicationId: string, data: { 
    employer_comment?: string; 
    employer_note?: string;
  }) => request(`/applications/${applicationId}/feedback`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

// Favorites API
export const favoritesApi = {
  sync: (data: { opportunity_ids: string[]; company_ids: string[] }) => 
    request('/favorites/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getFavoriteOpportunities: () => request('/favorites/opportunities'),
  
  addOpportunity: (opportunityId: string, note?: string) => 
    request(`/favorites/opportunities/${opportunityId}`, {
      method: 'POST',
      body: JSON.stringify(note ? { note } : undefined),
    }),
  
  removeOpportunity: (opportunityId: string) => 
    request(`/favorites/opportunities/${opportunityId}`, {
      method: 'DELETE',
    }),
  
  getFavoriteCompanies: () => request('/favorites/companies'),
  
  addCompany: (companyId: string) => 
    request(`/favorites/companies/${companyId}`, {
      method: 'POST',
    }),
  
  removeCompany: (companyId: string) => 
    request(`/favorites/companies/${companyId}`, {
      method: 'DELETE',
    }),
};

// Events API
export const eventsApi = {
  getInfo: (opportunityId: string) => request(`/events/${opportunityId}/info`),
  
  register: (opportunityId: string) => 
    request(`/events/${opportunityId}/register`, {
      method: 'POST',
    }),
  
  cancelRegistration: (opportunityId: string) => 
    request(`/events/${opportunityId}/register`, {
      method: 'DELETE',
    }),
  
  getParticipants: (opportunityId: string, limit = 100, offset = 0) => 
    request(`/events/${opportunityId}/participants?limit=${limit}&offset=${offset}`),
  
  checkIn: (opportunityId: string, checkInCode: string) => 
    request(`/events/${opportunityId}/check-in`, {
      method: 'POST',
      body: JSON.stringify({ check_in_code: checkInCode }),
    }),
};

// Applicants API
export const applicantsApi = {
  search: (params: {
    skills?: string;
    university?: string;
    graduation_year?: number;
    city?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.university) queryParams.append('university', params.university);
    if (params.graduation_year) queryParams.append('graduation_year', String(params.graduation_year));
    if (params.city) queryParams.append('city', params.city);
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));
    
    return request(`/applicants/search?${queryParams}`);
  },
  
  getProfile: (profileId: string) => request(`/applicants/${profileId}`),
  
  sendContactRequest: (profileId: string, message?: string) => 
    request(`/applicants/${profileId}/contact${message ? `?message=${encodeURIComponent(message)}` : ''}`, {
      method: 'POST',
    }),
};

// Glossary API
export const glossaryApi = {
  getSkills: (params?: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    return request(`/glossary/skills?${queryParams}`);
  },
  
  getTags: (params?: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    return request(`/glossary/tags?${queryParams}`);
  },
  
  getCategories: () => request('/glossary/categories'),
};

// Uploads API
export const uploadsApi = {
  uploadCv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return requestWithFile('/uploads/cv', formData);
  },
  
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return requestWithFile('/uploads/media', formData);
  },
};

// Recommendations API
export const recommendationsApi = {
  create: (data: { recipient_id: string; opportunity_id: string; message?: string }) => 
    request('/recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getSent: (limit = 50, offset = 0) => 
    request(`/recommendations/sent?limit=${limit}&offset=${offset}`),
  
  getReceived: (limit = 50, offset = 0) => 
    request(`/recommendations/received?limit=${limit}&offset=${offset}`),
  
  markAsRead: (recommendationId: string) => 
    request(`/recommendations/${recommendationId}/read`, {
      method: 'PATCH',
    }),
};

// Health check
export const healthApi = {
  check: () => fetch(`${API_URL}/health`).then(handleResponse),
};
