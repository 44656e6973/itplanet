import { useEffect, useState } from 'react';
import { useEmployerStore } from '@/stores/employerStore';
import type { Application, ApplicationStatus } from '@/types/api';

export const EmployerApplications = () => {
  const { opportunities, fetchOpportunities, fetchOpportunityApplications, applications, getApplicationDetail, updateApplicationStatus } = useEmployerStore();
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOpportunities(100, 0);
  }, []);

  const handleSelectOpportunity = async (opportunityId: string) => {
    setSelectedOpportunityId(opportunityId);
    setLoading(true);
    try {
      await fetchOpportunityApplications(opportunityId, 50, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = async (applicationId: string) => {
    try {
      const data = await getApplicationDetail(applicationId);
      setSelectedApplication(data);
    } catch (error) {
      console.error('Failed to load application:', error);
    }
  };

  const handleUpdateStatus = async (applicationId: string, status: ApplicationStatus) => {
    if (status === 'withdrawn') return; // Can't set withdrawn from employer side
    
    setUpdating(true);
    try {
      await updateApplicationStatus(applicationId, status as 'pending' | 'viewed' | 'accepted' | 'rejected' | 'reserve');
      if (selectedOpportunityId) {
        await fetchOpportunityApplications(selectedOpportunityId, 50, 0);
      }
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Не удалось обновить статус');
    } finally {
      setUpdating(false);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Отклики на вакансии</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Opportunity Selector & Applications List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Opportunity Selector */}
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите вакансию
            </label>
            <select
              value={selectedOpportunityId}
              onChange={(e) => handleSelectOpportunity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Выберите вакансию --</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.stats.applications_count} откликов)
                </option>
              ))}
            </select>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : applications.length === 0 ? (
            selectedOpportunityId && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">Нет откликов на эту вакансию</p>
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Кандидат</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {app.applicant_profile?.first_name} {app.applicant_profile?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {app.applicant_profile?.university}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                          {getStatusLabel(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewApplication(app.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Просмотреть
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Application Detail */}
        <div className="lg:col-span-1">
          {selectedApplication ? (
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedApplication.applicant_profile?.first_name} {selectedApplication.applicant_profile?.last_name}
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Статус</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusLabel(selectedApplication.status)}
                  </span>
                </div>

                {selectedApplication.cover_letter && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Сопроводительное письмо</p>
                    <p className="text-sm text-gray-700">{selectedApplication.cover_letter}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-2">Действия</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'accepted')}
                      disabled={updating}
                      className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                      disabled={updating}
                      className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Отклонить
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'reserve')}
                      disabled={updating}
                      className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      В резерв
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'viewed')}
                      disabled={updating}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Просмотрен
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              Выберите отклик для просмотра
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
