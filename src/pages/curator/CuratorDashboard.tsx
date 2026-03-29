import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCuratorStore } from '@/stores/curatorStore';

export const CuratorDashboard = () => {
  const { user } = useAuthStore();
  const { fetchPendingCompanies, fetchPendingOpportunities, pendingCompanies, pendingOpportunities } = useCuratorStore();

  useEffect(() => {
    fetchPendingCompanies(5, 0);
    fetchPendingOpportunities(5, 0);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#5f5ab4] mb-6">
        Панель куратора
      </h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/curator/companies" className="rounded-[14px] bg-[var(--app-card)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:opacity-90 transition-opacity">
          <h3 className="text-lg font-semibold text-[#6d69c2] mb-2">Компании на проверке</h3>
          <p className="text-3xl font-bold text-[#5c5cc0]">{pendingCompanies.length}</p>
          <p className="text-sm text-[#6d69c2] mt-2">Все заявки →</p>
        </Link>

        <Link to="/curator/opportunities" className="rounded-[14px] bg-[var(--app-card)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:opacity-90 transition-opacity">
          <h3 className="text-lg font-semibold text-[#6d69c2] mb-2">Вакансии на модерации</h3>
          <p className="text-3xl font-bold text-[#5c5cc0]">{pendingOpportunities.length}</p>
          <p className="text-sm text-[#6d69c2] mt-2">Все вакансии →</p>
        </Link>

        <div className="rounded-[14px] bg-[var(--app-card)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
          <h3 className="text-lg font-semibold text-[#6d69c2] mb-2">Профиль</h3>
          <p className="text-sm text-[#6d69c2] mt-2">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Pending Companies */}
      <div className="rounded-[14px] bg-[var(--app-card)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)] mb-6">
        <div className="px-6 py-4 border-b border-[#2e303a]/30 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#5f5ab4]">Последние заявки компаний</h3>
          <Link to="/curator/companies" className="text-sm text-[#5c5cc0] hover:underline">
            Все заявки →
          </Link>
        </div>
        <div className="divide-y divide-[#2e303a]/30">
          {pendingCompanies.length === 0 ? (
            <div className="px-6 py-8 text-center text-[#6d69c2]">
              Нет заявок на проверку
            </div>
          ) : (
            pendingCompanies.slice(0, 5).map((company) => (
              <div key={company.company_id} className="px-6 py-4 hover:bg-[var(--app-mint)] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[#5f5ab4]">{company.company_name}</h4>
                    <p className="text-sm text-[#6d69c2]">ИНН: {company.inn}</p>
                    <p className="text-sm text-[#6d69c2]">Email: {company.owner_email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-[#f0c94e] text-[#171526]">
                      На проверке
                    </span>
                    <Link
                      to={`/curator/companies/${company.company_id}`}
                      className="text-sm text-[#5c5cc0] hover:underline"
                    >
                      Проверить
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Opportunities */}
      <div className="rounded-[14px] bg-[var(--app-card)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="px-6 py-4 border-b border-[#2e303a]/30 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#5f5ab4]">Вакансии на модерации</h3>
          <Link to="/curator/opportunities" className="text-sm text-[#5c5cc0] hover:underline">
            Все вакансии →
          </Link>
        </div>
        <div className="divide-y divide-[#2e303a]/30">
          {pendingOpportunities.length === 0 ? (
            <div className="px-6 py-8 text-center text-[#6d69c2]">
              Нет вакансий на модерации
            </div>
          ) : (
            pendingOpportunities.slice(0, 5).map((opp) => (
              <div key={opp.id} className="px-6 py-4 hover:bg-[var(--app-mint)] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[#5f5ab4]">{opp.title}</h4>
                    <p className="text-sm text-[#6d69c2]">{opp.company.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-[#f5a623] text-[#171526]">
                      На модерации
                    </span>
                    <Link
                      to={`/curator/opportunities/${opp.id}`}
                      className="text-sm text-[#5c5cc0] hover:underline"
                    >
                      Проверить
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
