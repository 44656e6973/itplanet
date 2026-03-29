import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEmployerStore } from '@/stores/employerStore';

export const EmployerOpportunities = () => {
  const { opportunities, fetchOpportunities, deleteOpportunity } = useEmployerStore();

  useEffect(() => {
    fetchOpportunities(50, 0);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить вакансию?')) return;
    await deleteOpportunity(id);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Черновик',
      active: 'Активна',
      planned: 'На модерации',
      paused: 'Приостановлена',
      closed: 'Закрыта',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      planned: 'bg-yellow-100 text-yellow-800',
      paused: 'bg-orange-100 text-orange-800',
      closed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Мои вакансии</h2>
        <Link
          to="/employer/opportunities/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Создать вакансию
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">У вас пока нет вакансий</p>
          <Link to="/employer/opportunities/new" className="text-blue-600 hover:underline">
            Создать первую вакансию →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Отклики</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Просмотры</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{opportunity.title}</div>
                    <div className="text-sm text-gray-500">{opportunity.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(opportunity.status)}`}>
                      {getStatusLabel(opportunity.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {opportunity.stats.applications_count}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {opportunity.stats.views_count}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(opportunity.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/employer/opportunities/${opportunity.id}`}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(opportunity.id)}
                      className="text-red-600 hover:underline"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
