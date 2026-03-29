import { useEffect, useState } from 'react';
import { useCuratorStore } from '@/stores/curatorStore';
import type { CompanyVerificationDetailResponse } from '@/types/api';

export const CuratorCompanies = () => {
  const { pendingCompanies, fetchPendingCompanies, reviewCompany } = useCuratorStore();
  const [selectedCompany, setSelectedCompany] = useState<CompanyVerificationDetailResponse | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [comment, setComment] = useState('');
  const [approve, setApprove] = useState(true);

  useEffect(() => {
    fetchPendingCompanies(50, 0);
  }, []);

  const handleReview = async (companyId: string) => {
    if (!approve && !comment.trim()) {
      alert('При отклонении необходимо указать причину');
      return;
    }

    setReviewing(true);
    try {
      await reviewCompany(companyId, approve, comment || undefined);
      setSelectedCompany(null);
      setComment('');
    } catch (error) {
      console.error('Failed to review company:', error);
      alert('Ошибка при проверке компании');
    } finally {
      setReviewing(false);
    }
  };

  const cardClass = 'rounded-[14px] bg-[var(--app-card)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]';
  const inputClass = 'w-full px-4 py-2.5 rounded-[12px] border-none bg-[var(--app-mint)] text-[#6d69c2] placeholder:text-[#9da3e4] focus:outline-none focus:ring-2 focus:ring-[#5c5cc0] transition-colors';

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#5f5ab4] mb-6">Проверка компаний</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Companies List */}
        <div className="lg:col-span-2">
          {pendingCompanies.length === 0 ? (
            <div className={`${cardClass} p-12 text-center`}>
              <p className="text-[#6d69c2]">Нет заявок на проверку</p>
            </div>
          ) : (
            <div className={`${cardClass} overflow-hidden`}>
              <table className="min-w-full">
                <thead className="bg-[var(--app-mint)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">Компания</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">ИНН</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6d69c2] uppercase">Дата</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6d69c2] uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2e303a]/30">
                  {pendingCompanies.map((company) => (
                    <tr key={company.company_id} className="hover:bg-[var(--app-mint)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#5f5ab4]">{company.company_name}</div>
                        <div className="text-sm text-[#6d69c2]">{company.legal_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5f5ab4]">{company.inn}</td>
                      <td className="px-6 py-4 text-sm text-[#5f5ab4]">{company.owner_email}</td>
                      <td className="px-6 py-4 text-sm text-[#6d69c2]">
                        {new Date(company.submitted_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedCompany(company)}
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

        {/* Company Detail */}
        <div className="lg:col-span-1">
          {selectedCompany ? (
            <div className={`${cardClass} p-6 sticky top-4`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#5f5ab4]">{selectedCompany.company_name}</h3>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-[#6d69c2] hover:text-[#5c5cc0] text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[#6d69c2]">ИНН</p>
                  <p className="font-medium text-[#5f5ab4]">{selectedCompany.inn}</p>
                </div>
                <div>
                  <p className="text-[#6d69c2]">ОГРН</p>
                  <p className="font-medium text-[#5f5ab4]">{selectedCompany.ogrn}</p>
                </div>
                <div>
                  <p className="text-[#6d69c2]">Email</p>
                  <p className="font-medium text-[#5f5ab4]">{selectedCompany.owner_email}</p>
                </div>
                {selectedCompany.city && (
                  <div>
                    <p className="text-[#6d69c2]">Город</p>
                    <p className="font-medium text-[#5f5ab4]">{selectedCompany.city}</p>
                  </div>
                )}
                {selectedCompany.industry && (
                  <div>
                    <p className="text-[#6d69c2]">Отрасль</p>
                    <p className="font-medium text-[#5f5ab4]">{selectedCompany.industry}</p>
                  </div>
                )}
                {selectedCompany.company_size && (
                  <div>
                    <p className="text-[#6d69c2]">Размер компании</p>
                    <p className="font-medium text-[#5f5ab4]">{selectedCompany.company_size}</p>
                  </div>
                )}
                {selectedCompany.description && (
                  <div>
                    <p className="text-[#6d69c2]">Описание</p>
                    <p className="mt-1 text-[#5f5ab4]">{selectedCompany.description}</p>
                  </div>
                )}

                {/* Verification Links */}
                {selectedCompany.verification_links && selectedCompany.verification_links.length > 0 && (
                  <div>
                    <p className="text-[#6d69c2] mb-2">Ссылки</p>
                    <ul className="space-y-1">
                      {selectedCompany.verification_links.map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#5c5cc0] hover:underline"
                          >
                            {link.type}: {link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Documents */}
                {selectedCompany.documents && selectedCompany.documents.length > 0 && (
                  <div>
                    <p className="text-[#6d69c2] mb-2">Документы</p>
                    <ul className="space-y-1">
                      {selectedCompany.documents.map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#5c5cc0] hover:underline"
                          >
                            {doc.name || `Документ ${idx + 1}`}
                          </a>
                        </li>
                      ))}
                    </ul>
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
                    required={!approve}
                  />

                  <button
                    onClick={() => handleReview(selectedCompany.company_id)}
                    disabled={reviewing || (!approve && !comment.trim())}
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
              <p className="text-[#6d69c2]">Выберите компанию для проверки</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
