import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApplicantStore } from '@/stores/applicantStore';

export const ApplicantFavorites = () => {
  const { 
    favoriteOpportunities, 
    favoriteCompanies,
    fetchFavoriteOpportunities, 
    fetchFavoriteCompanies,
    removeFromFavorites,
    removeCompanyFromFavorites,
  } = useApplicantStore();

  useEffect(() => {
    fetchFavoriteOpportunities();
    fetchFavoriteCompanies();
  }, []);

  const handleRemoveOpportunity = async (id: string) => {
    if (!confirm('Удалить вакансию из избранного?')) return;
    await removeFromFavorites(id);
  };

  const handleRemoveCompany = async (id: string) => {
    if (!confirm('Удалить компанию из избранного?')) return;
    await removeCompanyFromFavorites(id);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Избранное</h2>

      {/* Favorite Opportunities */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Избранные вакансии</h3>
        
        {favoriteOpportunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">У вас пока нет избранных вакансий</p>
            <Link to="/" className="text-blue-600 hover:underline mt-2 block">
              Найти вакансии →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteOpportunities.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 line-clamp-2">
                    {item.opportunity.title}
                  </h4>
                  <button
                    onClick={() => handleRemoveOpportunity(item.opportunity.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Удалить
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {item.opportunity.company.name}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item.opportunity.work_format === 'remote' ? 'Удалённо' :
                     item.opportunity.work_format === 'hybrid' ? 'Гибрид' :
                     item.opportunity.work_format === 'office' ? 'Офис' :
                     item.opportunity.work_format}
                  </span>
                  {item.opportunity.salary.min || item.opportunity.salary.max ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {item.opportunity.salary.min?.toLocaleString('ru-RU') || 'от'} - {item.opportunity.salary.max?.toLocaleString('ru-RU') || ''} {item.opportunity.salary.currency}
                    </span>
                  ) : null}
                </div>
                
                {item.note && (
                  <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700">
                    <strong>Заметка:</strong> {item.note}
                  </div>
                )}
                
                <Link
                  to={`/opportunities/${item.opportunity.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Подробнее →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Companies */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Избранные компании</h3>
        
        {favoriteCompanies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">У вас пока нет избранных компаний</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {favoriteCompanies.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {item.company.name}
                  </h4>
                  <button
                    onClick={() => handleRemoveCompany(item.company.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Удалить
                  </button>
                </div>
                
                {item.company.city && (
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {item.company.city}
                  </p>
                )}
                
                <p className="text-xs text-gray-500">
                  Добавлено: {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
