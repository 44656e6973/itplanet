import { useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Map } from '../components/map/Map';
import type { MapMarker } from '../types';

const PAGE_SIZE = 28;

const filterOptions = ['Все', 'Мероприятие', 'Вакансия', 'Стажировка'] as const;

type FilterOption = (typeof filterOptions)[number];

interface OpportunityCard {
  id: string;
  title: string;
  type: Exclude<FilterOption, 'Все'>;
  date: string;
}

const mapMarkers: MapMarker[] = [
  { id: 'north-west', position: { lat: 60.8, lng: 31.5 }, title: 'Северо-запад' },
  { id: 'west', position: { lat: 56.1, lng: 40.9 }, title: 'Западный кластер' },
  { id: 'center', position: { lat: 57.4, lng: 60.2 }, title: 'Центр' },
  { id: 'south', position: { lat: 47.5, lng: 35.2 }, title: 'Юг' },
  { id: 'mid-east', position: { lat: 50.7, lng: 54.8 }, title: 'Средний восток' },
  { id: 'south-east', position: { lat: 49.2, lng: 79.9 }, title: 'Юго-восток' },
  { id: 'far-east', position: { lat: 60.5, lng: 97.3 }, title: 'Дальний восток' },
];

const opportunities: OpportunityCard[] = Array.from({ length: 84 }, (_, index) => ({
  id: `opportunity-${index + 1}`,
  title: 'Название',
  type: filterOptions[((index % (filterOptions.length - 1)) + 1) as 1 | 2 | 3],
  date: 'Дата',
}));

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

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    aria-hidden="true"
    className={`h-5 w-5 ${direction === 'left' ? '' : 'rotate-180'}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5 5.5 8.5 12l7 6.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('Все');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredOpportunities = opportunities.filter((card) => {
    const matchesFilter = activeFilter === 'Все' || card.type === activeFilter;
    const matchesQuery = normalizedQuery.length === 0
      || card.title.toLowerCase().includes(normalizedQuery)
      || card.type.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOpportunities.length / PAGE_SIZE));
  const pagedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-white">
      <Header />

      <main className="mx-auto max-w-[1108px] px-4 pb-8 pt-9 sm:px-6 lg:px-8">
        <section className="animate-fade-up opacity-0 [--animation-delay:0.05s]">
          <div className="h-[360px] overflow-hidden rounded-[16px] bg-[var(--app-mint)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:h-[430px] lg:h-[584px]">
            <Map markers={mapMarkers} />
          </div>
        </section>

        <section className="animate-fade-up opacity-0 [--animation-delay:0.12s]">
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:max-w-[315px]">
              <span className="sr-only">Поиск возможностей</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Поиск"
                className="h-8 w-full rounded-[12px] border-none bg-[var(--app-mint)] px-4 pr-10 text-[15px] text-[#6d69c2] outline-none placeholder:text-[#9da3e4]"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
            </label>

            <div className="relative sm:w-[158px]">
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
                      key={option}
                      type="button"
                      onClick={() => {
                        setActiveFilter(option);
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full rounded-[10px] px-3 py-2 text-left text-[14px] transition-colors ${
                        option === activeFilter
                          ? 'bg-[#e6e9ff] text-[#4d47a2]'
                          : 'text-[#6d69c2] hover:bg-[#eef1ff]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="opportunities" className="animate-fade-up opacity-0 [--animation-delay:0.18s]">
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
            {pagedOpportunities.map((card, index) => (
              <article
                key={card.id}
                className="rounded-[14px] bg-[var(--app-card)] px-3 pb-3 pt-2 text-[#5f5ab4] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                style={{ animationDelay: `${index * 0.02 + 0.2}s` }}
              >
                <div className="h-[82px] rounded-[4px] bg-[#c6def3]" />
                <div className="pt-3">
                  <h3 className="text-[14px] leading-[1.1]">Название</h3>
                  <p className="mt-1 text-[11px] leading-[1.15] text-[#8d89d8]">
                    Тип ({card.type.toLowerCase()})
                  </p>
                  <p className="mt-1 text-[11px] leading-[1.15] text-[#8d89d8]">{card.date}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-11 flex items-center justify-center gap-4 text-[#eef0ff]">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5c5cc0] transition-colors hover:bg-[#7373d2] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Предыдущая страница"
            >
              <ArrowIcon direction="left" />
            </button>

            <p className="min-w-[76px] text-center text-[18px] tracking-[0.04em]">
              {currentPage} ... {String(totalPages).padStart(2, '0')}
            </p>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5c5cc0] transition-colors hover:bg-[#7373d2] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Следующая страница"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
