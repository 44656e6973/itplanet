import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApplicantStore } from '@/stores/applicantStore';
import type { Application } from '@/types/api';

export const ApplicationDetail = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { getApplicationDetail, withdrawApplication } = useApplicantStore();
  
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    
    setLoading(true);
    getApplicationDetail(applicationId)
      .then(setApplication)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [applicationId]);

  const handleWithdraw = async () => {
    if (!applicationId || !confirm('Вы уверены, что хотите отозвать отклик?')) return;
    
    setWithdrawing(true);
    try {
      await withdrawApplication(applicationId);
      navigate('/applicant/applications');
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      alert('Не удалось отозвать отклик');
    } finally {
      setWithdrawing(false);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Отклик не найден</p>
        <Link to="/applicant/applications" className="text-blue-600 hover:underline mt-2 block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  const canWithdraw = application.status === 'pending' || application.status === 'viewed';

  return (
    <div>
      <div className="mb-6">
        <Link to="/applicant/applications" className="text-blue-600 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {application.opportunity?.title || 'Вакансия'}
            </h2>
            <p className="text-gray-600 mt-1">
              {application.company?.name || 'Компания'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(application.status)}`}>
              {getStatusLabel(application.status)}
            </span>
            {canWithdraw && (
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
              >
                {withdrawing ? 'Отзыв...' : 'Отозвать отклик'}
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Opportunity Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Информация о вакансии</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Формат работы</p>
                <p className="text-gray-900">
                  {application.opportunity?.work_format === 'remote' ? 'Удалённо' :
                   application.opportunity?.work_format === 'hybrid' ? 'Гибрид' :
                   application.opportunity?.work_format === 'office' ? 'Офис' :
                   application.opportunity?.work_format}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Город</p>
                <p className="text-gray-900">{application.opportunity?.city || 'Не указан'}</p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Сопроводительное письмо</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{application.cover_letter}</p>
            </div>
          )}

          {/* Employer Comment */}
          {application.employer_comment && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Комментарий работодателя</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-gray-700">{application.employer_comment}</p>
              </div>
            </div>
          )}

          {/* Status History */}
          {application.status_history && application.status_history.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">История изменений статуса</h3>
              <div className="space-y-2">
                {application.status_history.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                    <span className="text-gray-500">
                      {new Date(item.changed_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Дата отклика</p>
              <p className="text-gray-900">
                {new Date(application.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            {application.viewed_at && (
              <div>
                <p className="text-sm text-gray-500">Дата просмотра</p>
                <p className="text-gray-900">
                  {new Date(application.viewed_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
