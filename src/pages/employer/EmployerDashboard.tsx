import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEmployerStore } from '@/stores/employerStore';

export const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const { fetchOpportunities, opportunities } = useEmployerStore();

  useEffect(() => {
    fetchOpportunities(5, 0);
  }, []);

  // Calculate stats
  const activeOpportunities = opportunities.filter(o => o.status === 'active').length;
  const totalApplications = opportunities.reduce((sum, o) => sum + o.stats.applications_count, 0);
  const totalViews = opportunities.reduce((sum, o) => sum + o.stats.views_count, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Добро пожаловать, {user?.profile?.first_name || 'Работодатель'}!
      </h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Всего вакансий</h3>
          <p className="text-3xl font-bold text-blue-600">{opportunities.length}</p>
          <Link to="/employer/opportunities" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Все вакансии →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Активные</h3>
          <p className="text-3xl font-bold text-green-600">{activeOpportunities}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Отклики</h3>
          <p className="text-3xl font-bold text-purple-600">{totalApplications}</p>
          <Link to="/employer/applications" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Все отклики →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Просмотры</h3>
          <p className="text-3xl font-bold text-orange-600">{totalViews}</p>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Последние вакансии</h3>
          <Link
            to="/employer/opportunities/new"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Создать вакансию
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {opportunities.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              У вас пока нет вакансий. <Link to="/employer/opportunities/new" className="text-blue-600 hover:underline">Создать первую</Link>
            </div>
          ) : (
            opportunities.slice(0, 5).map((opportunity) => (
              <div key={opportunity.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span>
                        {opportunity.work_format === 'remote' ? 'Удалённо' :
                         opportunity.work_format === 'hybrid' ? 'Гибрид' :
                         opportunity.work_format === 'office' ? 'Офис' :
                         opportunity.work_format}
                      </span>
                      {opportunity.salary.min || opportunity.salary.max ? (
                        <span>
                          {opportunity.salary.min?.toLocaleString('ru-RU') || 'от'} - {opportunity.salary.max?.toLocaleString('ru-RU') || ''} {opportunity.salary.currency}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{opportunity.stats.applications_count}</span> откликов
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{opportunity.stats.views_count}</span> просмотров
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      opportunity.status === 'active' ? 'bg-green-100 text-green-800' :
                      opportunity.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      opportunity.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                      opportunity.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {opportunity.status === 'active' ? 'Активна' :
                       opportunity.status === 'draft' ? 'Черновик' :
                       opportunity.status === 'planned' ? 'На модерации' :
                       opportunity.status === 'paused' ? 'Приостановлена' : 'Закрыта'}
                    </span>
                    <Link
                      to={`/employer/opportunities/${opportunity.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Редактировать
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/employer/opportunities/new"
          className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <h3 className="text-lg font-semibold mb-2">Создать вакансию</h3>
          <p className="text-sm opacity-90">Опубликовать новую вакансию или мероприятие</p>
        </Link>

        <Link
          to="/employer/applications"
          className="block bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all"
        >
          <h3 className="text-lg font-semibold mb-2">Отклики</h3>
          <p className="text-sm opacity-90">Просмотреть отклики на ваши вакансии</p>
        </Link>

        <Link
          to="/employer/company"
          className="block bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow hover:from-purple-600 hover:to-purple-700 transition-all"
        >
          <h3 className="text-lg font-semibold mb-2">Профиль компании</h3>
          <p className="text-sm opacity-90">Управление информацией о компании</p>
        </Link>
      </div>
    </div>
  );
};
