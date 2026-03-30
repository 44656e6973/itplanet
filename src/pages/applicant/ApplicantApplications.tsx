import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplicantStore } from '@/stores/applicantStore';

export const ApplicantApplications = () => {
  const { applications, fetchApplications, withdrawApplication } = useApplicantStore();
  const [loading, setLoading] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchApplications(50, 0).finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Вы уверены, что хотите отозвать отклик?')) return;
    
    setWithdrawingId(applicationId);
    try {
      await withdrawApplication(applicationId);
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      alert('Не удалось отозвать отклик');
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'На рассмотрении',
      viewed: 'Просмотрен',
      accepted: 'Одобрен',
      rejected: 'Отклонён',
      reserve: 'В резерве',
      withdrawn: 'Отозван',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      viewed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      reserve: 'bg-purple-100 text-purple-800',
      withdrawn: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Мои отклики</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">У вас пока нет откликов</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Найти вакансии →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Вакансия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Компания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата отклика
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.opportunity?.title || 'Вакансия'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.opportunity?.work_format === 'remote' ? 'Удалённо' : 
                         application.opportunity?.work_format === 'hybrid' ? 'Гибрид' :
                         application.opportunity?.work_format === 'office' ? 'Офис' :
                         application.opportunity?.work_format}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.company?.name || 'Компания'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}>
                        {getStatusLabel(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/applicant/applications/${application.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Подробнее
                      </Link>
                      {(application.status === 'pending' || application.status === 'viewed') && (
                        <button
                          onClick={() => handleWithdraw(application.id)}
                          disabled={withdrawingId === application.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {withdrawingId === application.id ? '...' : 'Отозвать'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
