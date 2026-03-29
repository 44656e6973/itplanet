import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Footer } from '../components/common/Footer';
import { Header } from '../components/common/Header';
import { Map as OpportunitiesMap } from '../components/map/Map';
import {
  fetchOpportunities,
  getOpportunityCoordinates,
  getOpportunityLocationKey,
  getOpportunityLocationLabel,
  resolveOpportunityCoordinates,
} from '@/lib/opportunities';
import type { Coordinates, MapMarker, Opportunity, OpportunityType } from '@/types';

const PAGE_SIZE = 50;

const filterOptions = [
  { label: 'Все', type: null },
  { label: 'Вакансия', type: 'vacancy' },
  { label: 'Стажировка', type: 'internship' },
  { label: 'Мероприятие', type: 'event' },
  { label: 'Менторство', type: 'mentoring' },
] as const;

type FilterOption = (typeof filterOptions)[number]['label'];

interface MarkerGroup {
  key: string;
  title: string;
  description: string;
  coordinates: Coordinates | null;
  sampleOpportunity: Opportunity;
}

const typeLabels: Record<OpportunityType, string> = {
  vacancy: 'Вакансия',
  internship: 'Стажировка',
  event: 'Мероприятие',
  mentoring: 'Менторство',
};

const workFormatLabels = {
  office: 'Офис',
  hybrid: 'Гибрид',
  remote: 'Удалённо',
  online: 'Онлайн',
} as const;

const experienceLabels = {
  intern: 'Intern',
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
  lead: 'Lead',
} as const;

const employmentLabels = {
  full_time: 'Полная занятость',
  part_time: 'Частичная занятость',
  project: 'Проектная работа',
  volunteer: 'Волонтёрство',
} as const;

const salaryFormatter = new Intl.NumberFormat('ru-RU');
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 text-[#6a65bc]"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
    <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FilterIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 text-[#6a65bc]"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const getFilterType = (filter: FilterOption) =>
  filterOptions.find((option) => option.label === filter)?.type ?? null;

const getOpportunitySearchText = (opportunity: Opportunity) =>
  [
    opportunity.title,
    opportunity.company.name,
    getOpportunityLocationLabel(opportunity),
    typeLabels[opportunity.type],
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const formatOpportunityDate = (date: string) => dateFormatter.format(new Date(date));

const formatOpportunityLocation = (opportunity: Opportunity) =>
  getOpportunityLocationLabel(opportunity)
  || opportunity.company.city
  || 'Адрес уточняется';

const formatSalary = (opportunity: Opportunity) => {
  const salary = opportunity.salary;

  if (!salary || (salary.min === null && salary.max === null)) {
    return 'Зарплата не указана';
  }

  const currency = salary.currency ?? 'RUB';
  const formatAmount = (value: number) => `${salaryFormatter.format(value)} ${currency}`;

  if (salary.min !== null && salary.max !== null) {
    return `${formatAmount(salary.min)} - ${formatAmount(salary.max)}`;
  }

  if (salary.min !== null) {
    return `от ${formatAmount(salary.min)}`;
  }

  return `до ${formatAmount(salary.max ?? 0)}`;
};

const formatOpportunityMeta = (opportunity: Opportunity) => {
  const parts: string[] = [];

  if (opportunity.work_format) {
    parts.push(workFormatLabels[opportunity.work_format]);
  }

  if (opportunity.experience_level) {
    parts.push(experienceLabels[opportunity.experience_level]);
  }

  if (opportunity.employment_type) {
    parts.push(employmentLabels[opportunity.employment_type]);
  }

  return parts.length > 0 ? parts.join(' • ') : 'Формат уточняется';
};

const pluralizeOpportunities = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return 'возможность';
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'возможности';
  }

  return 'возможностей';
};

const describeCompanies = (companyNames: string[]) => {
  if (companyNames.length <= 2) {
    return companyNames.join(', ');
  }

  return `${companyNames.slice(0, 2).join(', ')} и ещё ${companyNames.length - 2}`;
};

const mergeOpportunities = (current: Opportunity[], next: Opportunity[]) => {
  const merged = new globalThis.Map(current.map((opportunity) => [opportunity.id, opportunity]));

  next.forEach((opportunity) => {
    merged.set(opportunity.id, opportunity);
  });

  return Array.from(merged.values());
};

const buildMarkerGroups = (
  opportunities: Opportunity[],
  resolvedCoordinates: Record<string, Coordinates>,
) => {
  const groups = new globalThis.Map<string, MarkerGroup & { companyNames: Set<string>; count: number }>();

  opportunities.forEach((opportunity) => {
    const key = getOpportunityLocationKey(opportunity);
    const directCoordinates = getOpportunityCoordinates(opportunity) ?? resolvedCoordinates[key] ?? null;
    const title = formatOpportunityLocation(opportunity);
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.count += 1;
      existingGroup.companyNames.add(opportunity.company.name);

      if (!existingGroup.coordinates && directCoordinates) {
        existingGroup.coordinates = directCoordinates;
      }

      return;
    }

    groups.set(key, {
      key,
      title,
      description: '',
      coordinates: directCoordinates,
      sampleOpportunity: opportunity,
      companyNames: new Set([opportunity.company.name]),
      count: 1,
    });
  });

  return Array.from(groups.values()).map((group) => ({
    key: group.key,
    title: group.title,
    description: `${describeCompanies(Array.from(group.companyNames))} • ${group.count} ${pluralizeOpportunities(group.count)}`,
    coordinates: group.coordinates,
    sampleOpportunity: group.sampleOpportunity,
  }));
};

const buildMapMarkers = (markerGroups: MarkerGroup[]): MapMarker[] =>
  markerGroups
    .filter((group) => group.coordinates)
    .map((group) => ({
      id: group.key,
      position: group.coordinates as Coordinates,
      title: group.title,
      description: group.description,
    }));

const OpportunitySkeleton = ({ index }: { index: number }) => (
  <div
    className="rounded-[14px] bg-[var(--app-card)] px-3 pb-3 pt-2 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
    style={{ animationDelay: `${index * 0.02}s` }}
  >
    <div className="h-[82px] animate-pulse rounded-[8px] bg-[#d7e4f2]" />
    <div className="space-y-2 pt-3">
      <div className="h-4 w-4/5 animate-pulse rounded bg-[#e4e8fb]" />
      <div className="h-3 w-3/4 animate-pulse rounded bg-[#e9ecff]" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-[#e9ecff]" />
    </div>
  </div>
);

export function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('Все');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [total, setTotal] = useState(0);
  const [nextOffset, setNextOffset] = useState(0);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [detectedFromIp, setDetectedFromIp] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedCoordinates, setResolvedCoordinates] = useState<Record<string, Coordinates>>({});

  const requestIdRef = useRef(0);
  const loadOpportunitiesRef = useRef<(mode: 'replace' | 'append') => Promise<void>>(async () => {});
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const pendingGeocodeKeysRef = useRef(new Set<string>());

  const activeType = getFilterType(activeFilter);
  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
  const shouldAutoLoad = normalizedQuery.length === 0;
  const hasMore = opportunities.length < total;

  const visibleOpportunities = opportunities.filter((opportunity) => {
    const matchesType = activeType === null || opportunity.type === activeType;
    const matchesQuery = normalizedQuery.length === 0
      || getOpportunitySearchText(opportunity).includes(normalizedQuery);

    return matchesType && matchesQuery;
  });

  const markerGroups = buildMarkerGroups(visibleOpportunities, resolvedCoordinates);
  const mapMarkers = buildMapMarkers(markerGroups);

  const loadOpportunities = async (mode: 'replace' | 'append') => {
    if (mode === 'append' && (isInitialLoading || isLoadingMore || !hasMore)) {
      return;
    }

    const requestId = ++requestIdRef.current;
    const offset = mode === 'replace' ? 0 : nextOffset;

    if (mode === 'replace') {
      setIsInitialLoading(true);
      setIsLoadingMore(false);
      setError(null);
      setTotal(0);
      setNextOffset(0);
      setDetectedCity(null);
      setDetectedFromIp(false);
      startTransition(() => {
        setOpportunities([]);
      });
    } else {
      setIsLoadingMore(true);
      setError(null);
    }

    try {
      const response = await fetchOpportunities({
        types: activeType ? [activeType] : undefined,
        limit: PAGE_SIZE,
        offset,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setTotal(response.total);
      setNextOffset(response.offset + response.items.length);
      setDetectedCity(response.detected_city);
      setDetectedFromIp(response.detected_from_ip);

      startTransition(() => {
        setOpportunities((current) =>
          mode === 'replace' ? response.items : mergeOpportunities(current, response.items)
        );
      });
    } catch (loadError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить возможности.');

      if (mode === 'replace') {
        startTransition(() => {
          setOpportunities([]);
        });
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    }
  };

  loadOpportunitiesRef.current = loadOpportunities;

  useEffect(() => {
    void loadOpportunitiesRef.current('replace');
  }, [activeType]);

  useEffect(() => {
    const node = loadMoreTriggerRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (
        !entry?.isIntersecting
        || !shouldAutoLoad
        || isInitialLoading
        || isLoadingMore
        || !hasMore
      ) {
        return;
      }

      void loadOpportunitiesRef.current('append');
    }, {
      rootMargin: '320px 0px',
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isInitialLoading, isLoadingMore, shouldAutoLoad]);

  useEffect(() => {
    let isCancelled = false;
    const unresolvedGroups = markerGroups.filter((group) => (
      !group.coordinates && !pendingGeocodeKeysRef.current.has(group.key)
    ));

    if (unresolvedGroups.length === 0) {
      return;
    }

    void (async () => {
      for (const group of unresolvedGroups) {
        pendingGeocodeKeysRef.current.add(group.key);

        try {
          const coordinates = await resolveOpportunityCoordinates(group.sampleOpportunity);

          if (isCancelled) {
            return;
          }

          if (coordinates) {
            setResolvedCoordinates((current) => {
              if (current[group.key]) {
                return current;
              }

              return {
                ...current,
                [group.key]: coordinates,
              };
            });
          }
        } finally {
          pendingGeocodeKeysRef.current.delete(group.key);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [markerGroups]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-white">
      <Header />

      <main className="mx-auto max-w-[1108px] px-4 pb-8 pt-9 sm:px-6 lg:px-8">
        <section className="animate-fade-up opacity-0 [--animation-delay:0.05s]">
          <div className="h-[360px] overflow-hidden rounded-[16px] bg-[var(--app-mint)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:h-[430px] lg:h-[584px]">
            <OpportunitiesMap markers={mapMarkers} />
          </div>
        </section>

        <section className="animate-fade-up opacity-0 [--animation-delay:0.12s]">
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="relative block w-full sm:max-w-[315px]">
                <span className="sr-only">Поиск возможностей</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                  placeholder="Поиск"
                  className="h-8 w-full rounded-[12px] border-none bg-[var(--app-mint)] px-4 pr-10 text-[15px] text-[#6d69c2] outline-none placeholder:text-[#9da3e4]"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <SearchIcon />
                </span>
              </label>

              <div className="relative sm:w-[182px]">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((open) => !open)}
                  className="flex h-8 w-full items-center justify-between rounded-[12px] bg-[var(--app-mint)] px-4 text-[15px] text-[#6d69c2] transition-transform hover:-translate-y-0.5"
                >
                  <span>{activeFilter === 'Все' ? 'Фильтры' : activeFilter}</span>
                  <FilterIcon />
                </button>

                {isFilterOpen && (
                  <div className="absolute left-0 top-10 z-20 w-full rounded-[14px] bg-[#f9fbff] p-2 shadow-[0_14px_40px_rgba(11,10,22,0.35)]">
                    {filterOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          setActiveFilter(option.label);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full rounded-[10px] px-3 py-2 text-left text-[14px] transition-colors ${
                          option.label === activeFilter
                            ? 'bg-[#e6e9ff] text-[#4d47a2]'
                            : 'text-[#6d69c2] hover:bg-[#eef1ff]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[12px] text-[#d8dcff]">
              <span className="rounded-full bg-[#3f3f8f] px-3 py-1">
                Загружено {opportunities.length} из {total}
              </span>
              {detectedCity && (
                <span className="rounded-full bg-[#4647a2] px-3 py-1">
                  Город: {detectedCity}
                </span>
              )}
              {detectedCity && (
                <span className="rounded-full bg-[#5a5cc0] px-3 py-1">
                  {detectedFromIp ? 'Определён по IP' : 'Город подтверждён API'}
                </span>
              )}
            </div>
          </div>
        </section>

        <section id="opportunities" className="animate-fade-up opacity-0 [--animation-delay:0.18s]">
          {error && (
            <div className="mt-8 rounded-[14px] border border-[#6f77cb]/30 bg-[#2d316e] px-4 py-3 text-[14px] text-[#f2f4ff]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    void loadOpportunitiesRef.current(opportunities.length === 0 ? 'replace' : 'append');
                  }}
                  className="rounded-[10px] bg-[#6468d2] px-3 py-2 text-[13px] transition-colors hover:bg-[#7a7edf]"
                >
                  Повторить
                </button>
              </div>
            </div>
          )}

          {isInitialLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
              {Array.from({ length: 14 }, (_, index) => (
                <OpportunitySkeleton key={index} index={index} />
              ))}
            </div>
          ) : visibleOpportunities.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
              {visibleOpportunities.map((opportunity, index) => (
                <article
                  key={opportunity.id}
                  className="rounded-[14px] bg-[var(--app-card)] px-3 pb-3 pt-2 text-[#5f5ab4] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                  style={{ animationDelay: `${index * 0.02 + 0.2}s` }}
                >
                  <div className="flex h-[82px] flex-col justify-between rounded-[8px] bg-[linear-gradient(135deg,#c7dcf2_0%,#dae3ff_55%,#c3efe0_100%)] p-3 text-[#46539f]">
                    <span className="w-fit rounded-full bg-white/70 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#46539f]">
                      {typeLabels[opportunity.type]}
                    </span>
                    <p className="line-clamp-2 text-[12px] leading-[1.15] text-[#5560a6]">
                      {opportunity.company.name}
                    </p>
                  </div>

                  <div className="pt-3">
                    <h3 className="line-clamp-2 text-[14px] leading-[1.1] text-[#534d9a]">
                      {opportunity.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-[1.2] text-[#8d89d8]">
                      {formatOpportunityLocation(opportunity)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-[1.2] text-[#8d89d8]">
                      {formatOpportunityMeta(opportunity)}
                    </p>
                    <p className="mt-2 text-[11px] leading-[1.2] text-[#6f6ac5]">
                      {formatSalary(opportunity)}
                    </p>
                    <p className="mt-1 text-[11px] leading-[1.2] text-[#8d89d8]">
                      {opportunity.event_start_at
                        ? `Старт ${formatOpportunityDate(opportunity.event_start_at)}`
                        : `Опубликовано ${formatOpportunityDate(opportunity.published_at)}`}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[16px] bg-[var(--app-card)] px-6 py-10 text-center text-[#8d89d8] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              По текущему запросу подходящих возможностей пока нет.
            </div>
          )}

          <div ref={loadMoreTriggerRef} className="h-1" aria-hidden="true" />

          <div className="mt-8 flex flex-col items-center gap-3 text-center text-[14px] text-[#d7dbff]">
            {isLoadingMore && <p>Загружаем ещё возможности...</p>}

            {!isInitialLoading && hasMore && !isLoadingMore && (
              <button
                type="button"
                onClick={() => {
                  void loadOpportunitiesRef.current('append');
                }}
                className="rounded-[12px] bg-[#5c5cc0] px-4 py-2 text-white transition-colors hover:bg-[#7373d2]"
              >
                {shouldAutoLoad ? 'Загрузить ещё' : 'Продолжить поиск'}
              </button>
            )}

            {!isInitialLoading && !hasMore && opportunities.length > 0 && (
              <p>Все доступные возможности загружены.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
