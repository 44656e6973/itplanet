import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useApplicantStore } from '@/stores/applicantStore';

export const ApplicantDashboard = () => {
  const { user } = useAuthStore();
  const { fetchApplications, fetchFavoriteOpportunities, applications, favoriteOpportunities } = useApplicantStore();

  useEffect(() => {
    fetchApplications(5, 0);
    fetchFavoriteOpportunities();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Добро пожаловать, {user?.profile?.first_name || 'Соискатель'}!
      </h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Мои отклики</h3>
          <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
          <Link to="/applicant/applications" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Все отклики →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Избранное</h3>
          <p className="text-3xl font-bold text-green-600">{favoriteOpportunities.length}</p>
          <Link to="/applicant/favorites" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Избранные вакансии →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Профиль</h3>
          <p className="text-sm text-gray-600 mt-2">
            {user?.profile?.university || 'ВУЗ не указан'}
          </p>
          <Link to="/applicant/profile" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Редактировать →
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Последние отклики</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {applications.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              У вас пока нет откликов. <Link to="/" className="text-blue-600 hover:underline">Найти вакансии</Link>
            </div>
          ) : (
            applications.slice(0, 5).map((application) => (
              <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {application.opportunity?.title || 'Вакансия'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {application.company?.name || 'Компания'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'viewed' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status === 'pending' ? 'На рассмотрении' :
                       application.status === 'viewed' ? 'Просмотрен' :
                       application.status === 'accepted' ? 'Одобрен' :
                       application.status === 'rejected' ? 'Отклонён' :
                       application.status === 'reserve' ? 'В резерве' : 'Отозван'}
                    </span>
                    <Link
                      to={`/applicant/applications/${application.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/"
          className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <h3 className="text-lg font-semibold mb-2">Найти вакансию</h3>
          <p className="text-sm opacity-90">Посмотреть все доступные вакансии и мероприятия</p>
        </Link>

        <Link
          to="/applicant/profile"
          className="block bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all"
        >
          <h3 className="text-lg font-semibold mb-2">Редактировать профиль</h3>
          <p className="text-sm opacity-90">Обновить информацию о себе и навыки</p>
        </Link>
      </div>
    </div>
  );
};
