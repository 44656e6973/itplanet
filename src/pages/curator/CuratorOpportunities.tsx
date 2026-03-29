import { useEffect, useState } from 'react';
import { useCuratorStore } from '@/stores/curatorStore';
import type { ModerationOpportunityDetail } from '@/types/api';

export const CuratorOpportunities = () => {
  const { pendingOpportunities, fetchPendingOpportunities, getModerationOpportunityDetail, reviewOpportunity } = useCuratorStore();
  const [selectedOpportunity, setSelectedOpportunity] = useState<ModerationOpportunityDetail | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [comment, setComment] = useState('');
  const [approve, setApprove] = useState(true);

  useEffect(() => {
    fetchPendingOpportunities(50, 0);
  }, []);

  const handleSelectOpportunity = async (id: string) => {
    try {
      await getModerationOpportunityDetail(id);
      const opp = pendingOpportunities.find(o => o.id === id);
      setSelectedOpportunity(opp as unknown as ModerationOpportunityDetail);
    } catch (error) {
      console.error('Failed to load opportunity:', error);
    }
  };

  const handleReview = async (opportunityId: string) => {
    if (!approve && !comment.trim()) {
      alert('При отклонении необходимо указать причину');
      return;
    }

    setReviewing(true);
    try {
      await reviewOpportunity(opportunityId, approve, comment || undefined);
      setSelectedOpportunity(null);
      setComment('');
      fetchPendingOpportunities(50, 0);
    } catch (error) {
      console.error('Failed to review opportunity:', error);
      alert('Ошибка при модерации вакансии');
    } finally {
      setReviewing(false);
    }
  };

  const cardClass = 'rounded-[14px] bg-[var(--app-card)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]';
  const inputClass = 'w-full px-4 py-2.5 rounded-[12px] border-none bg-[var(--app-mint)] text-[#6d69c2] placeholder:text-[#9da3e4] focus:outline-none focus:ring-2 focus:ring-[#5c5cc0] transition-colors';

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vacancy: 'Вакансия',
      internship: 'Стажировка',
      event: 'Мероприятие',
      mentoring: 'Менторство',
    };
    return labels[type] || type;
  };

  const getWorkFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      remote: 'Удалённо',
      hybrid: 'Гибрид',
      office: 'Офис',
      online: 'Онлайн',
    };
    return labels[format] || format;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#5f5ab4] mb-6">Модерация вакансий</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunities List */}
        <div className="lg:col-span-2">
          {pendingOpportunities.length === 0 ? (
            <div className={`${cardClass} p-12 text-center`}>
              <p className="text-[#6d69c2]">Нет вакансий на модерации</p>
            </div>
          ) : (
            <div className={`${cardClass} overflow-hidden`}>
              <table className="min-w-full">
                <thead className="bg-[var(--app-mint)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">Компания</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">Тип</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">Дата</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6d69c2] uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2e303a]/30">
                  {pendingOpportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-[var(--app-mint)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#5f5ab4]">{opp.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5f5ab4]">{opp.company.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-[var(--app-mint)] text-[#6d69c2]">
                          {getTypeLabel(opp.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6d69c2]">
                        {new Date(opp.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSelectOpportunity(opp.id)}
                          className="text-[#5c5cc0] hover:underline"
                        >
                          Проверить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Opportunity Detail */}
        <div className="lg:col-span-1">
          {selectedOpportunity ? (
            <div className={`${cardClass} p-6 sticky top-4`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#5f5ab4]">{selectedOpportunity.title}</h3>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-[#6d69c2] hover:text-[#5c5cc0] text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[#6d69c2]">Компания</p>
                  <p className="font-medium text-[#5f5ab4]">{selectedOpportunity.company.name}</p>
                </div>
                <div>
                  <p className="text-[#6d69c2]">Тип</p>
                  <p className="font-medium text-[#5f5ab4]">{getTypeLabel(selectedOpportunity.type)}</p>
                </div>
                <div>
                  <p className="text-[#6d69c2]">Формат работы</p>
                  <p className="font-medium text-[#5f5ab4]">{getWorkFormatLabel(selectedOpportunity.work_format)}</p>
                </div>
                {selectedOpportunity.description && (
                  <div>
                    <p className="text-[#6d69c2]">Описание</p>
                    <p className="mt-1 text-[#5f5ab4] line-clamp-4">{selectedOpportunity.description}</p>
                  </div>
                )}
                {selectedOpportunity.requirements && (
                  <div>
                    <p className="text-[#6d69c2]">Требования</p>
                    <p className="mt-1 text-[#5f5ab4] line-clamp-3">{selectedOpportunity.requirements}</p>
                  </div>
                )}
                {selectedOpportunity.skills && selectedOpportunity.skills.length > 0 && (
                  <div>
                    <p className="text-[#6d69c2]">Навыки</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedOpportunity.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#5c5cc0] text-[#ecfffd] text-xs rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Form */}
                <div className="pt-4 border-t border-[#2e303a]/30">
                  <p className="text-[#5f5ab4] font-medium mb-3">Решение</p>

                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setApprove(true)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        approve
                          ? 'bg-[#5c5cc0] text-[#ecfffd]'
                          : 'bg-[var(--app-mint)] text-[#6d69c2] hover:opacity-90'
                      }`}
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => setApprove(false)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        !approve
                          ? 'bg-[#d9534f] text-[#ecfffd]'
                          : 'bg-[var(--app-mint)] text-[#6d69c2] hover:opacity-90'
                      }`}
                    >
                      Отклонить
                    </button>
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={approve ? 'Комментарий (необязательно)' : 'Причина отклонения (обязательно)'}
                    className={`${inputClass} mb-3 min-h-[80px] resize-none`}
                    rows={3}
                  />

                  <button
                    onClick={() => selectedOpportunity && handleReview(selectedOpportunity.id)}
                    disabled={reviewing}
                    className={`w-full px-4 py-2.5 rounded-lg text-[#ecfffd] transition-colors ${
                      approve
                        ? 'bg-[#5c5cc0] hover:bg-[#7373d2]'
                        : 'bg-[#d9534f] hover:bg-[#c9302c]'
                    } disabled:opacity-50`}
                  >
                    {reviewing ? 'Обработка...' : (approve ? 'Одобрить' : 'Отклонить')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${cardClass} p-12 text-center`}>
              <p className="text-[#6d69c2]">Выберите вакансию для проверки</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
