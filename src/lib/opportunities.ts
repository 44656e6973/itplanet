import type {
  Coordinates,
  OpportunitiesQuery,
  OpportunitiesResponse,
  Opportunity,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL;
const OPPORTUNITIES_API_URL = `${API_URL}/opportunities`;
const NOMINATIM_SEARCH_API_URL = 'https://nominatim.openstreetmap.org/search';
const MAX_LIMIT = 200;

interface ApiErrorResponse {
  error?: {
    message?: string;
  };
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
}

const geocodeCache = new Map<string, Promise<Coordinates | null>>();

const appendListParam = (params: URLSearchParams, name: string, values?: string[]) => {
  if (!values || values.length === 0) {
    return;
  }

  params.set(name, values.join(','));
};

const getOpportunitiesErrorMessage = async (response: Response) => {
  const data = await response.json().catch(() => ({} as ApiErrorResponse));
  return data.error?.message || `Ошибка ${response.status}`;
};

const normalizeQueryPart = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const buildLocationLabel = (...parts: Array<string | null | undefined>) =>
  parts
    .map(normalizeQueryPart)
    .filter((part): part is string => Boolean(part))
    .join(', ');

const isFiniteCoordinate = (value: number | null | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const fetchOpportunities = async ({
  city,
  types,
  workFormat,
  experienceLevel,
  employmentType,
  salaryMin,
  salaryMax,
  limit = 50,
  offset = 0,
}: OpportunitiesQuery = {}) => {
  const params = new URLSearchParams();

  if (city) {
    params.set('city', city);
  }

  appendListParam(params, 'type', types);
  appendListParam(params, 'work_format', workFormat);
  appendListParam(params, 'experience_level', experienceLevel);
  appendListParam(params, 'employment_type', employmentType);

  if (typeof salaryMin === 'number') {
    params.set('salary_min', String(salaryMin));
  }

  if (typeof salaryMax === 'number') {
    params.set('salary_max', String(salaryMax));
  }

  params.set('limit', String(Math.min(Math.max(limit, 1), MAX_LIMIT)));
  params.set('offset', String(Math.max(offset, 0)));

  const response = await fetch(`${OPPORTUNITIES_API_URL}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(await getOpportunitiesErrorMessage(response));
  }

  return response.json() as Promise<OpportunitiesResponse>;
};

export const getOpportunityLocationLabel = (opportunity: Opportunity) =>
  buildLocationLabel(
    opportunity.location.address,
    opportunity.location.city ?? opportunity.company.city,
  );

export const getOpportunityLocationKey = (opportunity: Opportunity) => {
  const locationLabel = getOpportunityLocationLabel(opportunity);

  if (locationLabel) {
    return locationLabel.toLowerCase();
  }

  return `${opportunity.company.id}:${opportunity.id}`;
};

export const getOpportunityCoordinates = (opportunity: Opportunity): Coordinates | null => {
  if (
    !isFiniteCoordinate(opportunity.location.lat)
    || !isFiniteCoordinate(opportunity.location.lng)
  ) {
    return null;
  }

  return {
    lat: opportunity.location.lat,
    lng: opportunity.location.lng,
  };
};

export const getOpportunityGeocodeQueries = (opportunity: Opportunity) => {
  const locationQuery = buildLocationLabel(
    opportunity.location.address,
    opportunity.location.city ?? opportunity.company.city,
    'Россия',
  );
  const cityQuery = buildLocationLabel(opportunity.location.city ?? opportunity.company.city, 'Россия');

  return [locationQuery, cityQuery].filter((query, index, queries): query is string => (
    Boolean(query) && queries.indexOf(query) === index
  ));
};

const geocodeAddress = (query: string) => {
  const cachedRequest = geocodeCache.get(query);

  if (cachedRequest) {
    return cachedRequest;
  }

  const request = (async () => {
    const params = new URLSearchParams({
      q: query,
      format: 'jsonv2',
      limit: '1',
      addressdetails: '0',
      'accept-language': 'ru',
    });

    const response = await fetch(`${NOMINATIM_SEARCH_API_URL}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as NominatimSearchResult[];
    const [firstMatch] = results;

    if (!firstMatch) {
      return null;
    }

    const lat = Number(firstMatch.lat);
    const lng = Number(firstMatch.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  })();

  geocodeCache.set(query, request);
  return request;
};

export const resolveOpportunityCoordinates = async (opportunity: Opportunity) => {
  const directCoordinates = getOpportunityCoordinates(opportunity);

  if (directCoordinates) {
    return directCoordinates;
  }

  const queries = getOpportunityGeocodeQueries(opportunity);

  for (const query of queries) {
    const coordinates = await geocodeAddress(query);

    if (coordinates) {
      return coordinates;
    }
  }

  return null;
};
