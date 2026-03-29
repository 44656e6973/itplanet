// Типы для приложения

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  title: string;
  description?: string;
}

export type OpportunityType = 'vacancy' | 'internship' | 'event' | 'mentoring';

export type OpportunityWorkFormat = 'office' | 'hybrid' | 'remote' | 'online';

export type OpportunityExperienceLevel = 'intern' | 'junior' | 'middle' | 'senior' | 'lead';

export type OpportunityEmploymentType = 'full_time' | 'part_time' | 'project' | 'volunteer';

export interface OpportunityCompany {
  id: string;
  name: string;
  logo_url: string | null;
  city: string | null;
}

export interface OpportunityLocation {
  lat: number | null;
  lng: number | null;
  address: string | null;
  city: string | null;
}

export interface OpportunitySalary {
  min: number | null;
  max: number | null;
  currency: string | null;
  gross: boolean | null;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  status: string;
  work_format: OpportunityWorkFormat | null;
  experience_level: OpportunityExperienceLevel | null;
  employment_type: OpportunityEmploymentType | null;
  company: OpportunityCompany;
  location: OpportunityLocation;
  salary: OpportunitySalary | null;
  tags: string[];
  published_at: string;
  expires_at: string | null;
  event_start_at: string | null;
  event_end_at: string | null;
  max_participants: number | null;
  current_participants: number;
  views_count: number;
  applications_count: number;
}

export interface OpportunitiesResponse {
  items: Opportunity[];
  total: number;
  limit: number;
  offset: number;
  detected_city: string | null;
  detected_from_ip: boolean;
}

export interface OpportunitiesQuery {
  city?: string;
  types?: OpportunityType[];
  workFormat?: OpportunityWorkFormat[];
  experienceLevel?: OpportunityExperienceLevel[];
  employmentType?: OpportunityEmploymentType[];
  salaryMin?: number;
  salaryMax?: number;
  limit?: number;
  offset?: number;
}

export interface MapState {
  center: Coordinates;
  zoom: number;
  markers: MapMarker[];
  selectedMarkerId: string | null;
}

export interface MapActions {
  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  addMarker: (marker: Omit<MapMarker, 'id'>) => void;
  removeMarker: (id: string) => void;
  updateMarker: (id: string, marker: Partial<MapMarker>) => void;
  selectMarker: (id: string | null) => void;
  resetMap: () => void;
}

export type MapStore = MapState & MapActions;
