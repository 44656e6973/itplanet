import { useEffect, useState } from 'react';
import { useEmployerStore } from '@/stores/employerStore';
import type { CompanyRegisterRequest, CompanyDocumentsRequest } from '@/types/api';
import { ProfileLayout } from '@/components/layout/ProfileLayout';
import { cn } from '@/lib/utils';

export const EmployerCompanyProfile = () => {
  const {
    verificationStatus,
    fetchVerificationStatus,
    verifyInn,
    registerCompany,
    submitCompanyDocuments,
  } = useEmployerStore();

  const [step, setStep] = useState<'inn' | 'register' | 'documents'>('inn');
  const [inn, setInn] = useState('');
  const [innData, setInnData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<Partial<CompanyRegisterRequest> | null>(null);

  const [companyData, setCompanyData] = useState<Partial<CompanyRegisterRequest>>({
    corporate_email: '',
    website_url: '',
    description: '',
    short_description: '',
    industry: '',
    company_size: '',
    verification_links: [],
  });

  const [documentsData, _setDocumentsData] = useState<Partial<CompanyDocumentsRequest>>({
    verification_links: [],
    documents: [],
    description: '',
  });

  // Mock data for events and vacancies (as shown in the image)
  const [events, setEvents] = useState<Array<{ id: number; title: string; date: string }>>([
    { id: 1, title: 'Мероприятие 1', date: 'Дата' },
    { id: 2, title: 'Мероприятие 2', date: 'Дата' },
    { id: 3, title: 'Мероприятие 3', date: 'Дата' },
  ]);

  const [vacancies, setVacancies] = useState<Array<{ id: number; title: string; status: string }>>([
    { id: 1, title: 'Вакансия 1', status: 'Дата отзыва' },
    { id: 2, title: 'Вакансия 2', status: 'Дата отзыва' },
    { id: 3, title: 'Вакансия 3', status: 'Дата отзыва' },
  ]);

  const [socialLinks, setSocialLinks] = useState<Array<{ id: number; text: string }>>([
    { id: 1, text: 'Гиперссылка на соцсеть' },
    { id: 2, text: 'Гиперссылка на соцсеть' },
    { id: 3, text: 'Гиперссылка на соцсеть' },
  ]);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  useEffect(() => {
    if (verificationStatus) {
      if (verificationStatus.verification_status === 'pending' ||
          verificationStatus.verification_status === 'approved') {
        setStep('documents');
      }
    }
  }, [verificationStatus]);

  const hasChanges = JSON.stringify(companyData) !== JSON.stringify(originalData);

  const handleVerifyInn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await verifyInn(inn) as Record<string, unknown>;
      setInnData(data);
      setSessionToken((data.session_token as string) || null);
      setStep('register');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка проверки ИНН');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerCompany({
        inn,
        session_token: sessionToken || undefined,
        corporate_email: companyData.corporate_email!,
        website_url: companyData.website_url,
        description: companyData.description,
        short_description: companyData.short_description,
        industry: companyData.industry,
        company_size: companyData.company_size,
        verification_links: companyData.verification_links || [],
      });
      setOriginalData(companyData);
      setStep('documents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации компании');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      await submitCompanyDocuments({
        verification_links: documentsData.verification_links,
        documents: documentsData.documents,
        description: documentsData.description,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки документов');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setCompanyData(originalData);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { id: Date.now(), text: 'Гиперссылка на соцсеть' }]);
  };

  const addEvent = () => {
    setEvents([...events, { id: Date.now(), title: 'Мероприятие', date: 'Дата' }]);
  };

  const addVacancy = () => {
    setVacancies([...vacancies, { id: Date.now(), title: 'Вакансия', status: 'Дата отзыва' }]);
  };

  const getVerificationStatusBadge = () => {
    if (!verificationStatus) return null;

    const status = verificationStatus.verification_status;
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    const labels: Record<string, string> = {
      pending: 'На проверке',
      approved: 'Верифицировано',
      rejected: 'Отклонено',
    };

    return (
      <div className="mb-6 p-4 rounded-lg border bg-[var(--app-card)] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
        <span className={`px-3 py-1 text-sm rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
          Статус верификации: {labels[status] || status}
        </span>
        {verificationStatus.curator_comment && (
          <p className="mt-2 text-sm text-[#6d69c2]">
            Комментарий: {verificationStatus.curator_comment}
          </p>
        )}
      </div>
    );
  };

  const inputClass = cn(
    'w-full px-4 py-2.5 rounded-[12px] border-none bg-[var(--app-mint)]',
    'text-[#6d69c2] placeholder:text-[#9da3e4]',
    'focus:outline-none focus:ring-2 focus:ring-[#5c5cc0]',
    'transition-colors'
  );

  const labelClass = 'block text-sm font-medium text-[#6d69c2] mb-2';
  const sectionTitleClass = 'text-xl font-semibold text-[#6d69c2] mb-4 pt-6 border-t border-[#2e303a]/30 first:pt-0 first:border-t-0';
  const cardClass = 'rounded-[14px] bg-[var(--app-card)] px-4 py-4 sm:px-6 sm:py-5 text-[#5f5ab4] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]';

  const sections = [
    { id: 'about', label: 'О нас' },
    { id: 'location', label: 'Где нас найти' },
    { id: 'events', label: 'Наши мероприятия' },
    { id: 'vacancies', label: 'Наши вакансии' },
  ];

  // INN Verification Step
  if (step === 'inn') {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-white">
        <div className="mx-auto max-w-[1108px] px-4 py-6 sm:px-6 lg:px-8">
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-[#5f5ab4] mb-6">Профиль компании</h2>
            <form onSubmit={handleVerifyInn}>
              <h3 className="text-lg font-semibold text-[#5f5ab4] mb-4">Проверка ИНН</h3>
              <p className="text-sm text-[#6d69c2] mb-4">
                Введите ИНН вашей организации для проверки через ЕГРЮЛ
              </p>

              <div className="mb-4">
                <label className={labelClass}>ИНН</label>
                <input
                  type="text"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  pattern="[0-9]{10,12}"
                  placeholder="10 или 12 цифр"
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || inn.length < 10}
                className="px-6 py-2.5 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                           hover:bg-[#7373d2] disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {loading ? 'Проверка...' : 'Проверить ИНН'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Company Registration Step
  if (step === 'register' && innData) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-white">
        <div className="mx-auto max-w-[1108px] px-4 py-6 sm:px-6 lg:px-8">
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-[#5f5ab4] mb-6">Профиль компании</h2>

            <div className="mb-6 p-4 bg-[var(--app-mint)] rounded-lg">
              <p className="font-medium text-[#5f5ab4]">{String(innData.full_name || '')}</p>
              <p className="text-sm text-[#6d69c2]">ИНН: {String(innData.inn || '')}</p>
              <p className="text-sm text-[#6d69c2]">ОГРН: {String(innData.ogrn || '')}</p>
              <p className="text-sm text-[#6d69c2]">Адрес: {String(innData.address || '')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Корпоративный email</label>
                <input
                  type="email"
                  value={companyData.corporate_email}
                  onChange={(e) => setCompanyData({ ...companyData, corporate_email: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Сайт компании</label>
                <input
                  type="url"
                  value={companyData.website_url}
                  onChange={(e) => setCompanyData({ ...companyData, website_url: e.target.value })}
                  className={inputClass}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className={labelClass}>Отрасль</label>
                <input
                  type="text"
                  value={companyData.industry}
                  onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                  className={inputClass}
                  placeholder="IT, Финансы, Ритейл..."
                />
              </div>

              <div>
                <label className={labelClass}>Размер компании</label>
                <select
                  value={companyData.company_size}
                  onChange={(e) => setCompanyData({ ...companyData, company_size: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Не указано</option>
                  <option value="1-10">1-10 сотрудников</option>
                  <option value="11-50">11-50 сотрудников</option>
                  <option value="51-200">51-200 сотрудников</option>
                  <option value="201-500">201-500 сотрудников</option>
                  <option value="500+">Более 500 сотрудников</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Краткое описание</label>
                <textarea
                  value={companyData.short_description}
                  onChange={(e) => setCompanyData({ ...companyData, short_description: e.target.value })}
                  className={cn(inputClass, 'min-h-[80px] resize-none')}
                  rows={2}
                  maxLength={500}
                  placeholder="До 500 символов"
                />
              </div>

              <div>
                <label className={labelClass}>Полное описание</label>
                <textarea
                  value={companyData.description}
                  onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                  className={cn(inputClass, 'min-h-[120px] resize-none')}
                  rows={4}
                  maxLength={5000}
                  placeholder="До 5000 символов"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setStep('inn')}
                className="px-6 py-2.5 border border-[#5c5cc0] text-[#6d69c2] rounded-lg
                           hover:bg-[var(--app-mint)] transition-colors"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={handleRegisterCompany}
                disabled={loading || !companyData.corporate_email}
                className="flex-1 px-6 py-2.5 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                           hover:bg-[#7373d2] disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {loading ? 'Регистрация...' : 'Зарегистрировать компанию'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Documents and Profile Management Step (with the design from the image)
  return (
    <ProfileLayout
      sections={sections}
      onSave={handleSubmitDocuments}
      onCancel={handleCancel}
      isSaving={loading}
      hasChanges={hasChanges}
    >
      {getVerificationStatusBadge()}

      {/* Header with Company Info */}
      <div className={cardClass}>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-[#c6def3] rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <input
              type="text"
              value={companyData.corporate_email || ''}
              onChange={(e) => setCompanyData({ ...companyData, corporate_email: e.target.value })}
              className={cn(inputClass, 'text-lg font-medium bg-transparent border-0 px-0 py-0 focus:ring-0')}
              placeholder="Название компании"
            />
            <input
              type="text"
              value={companyData.industry || ''}
              onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
              className={cn(inputClass, 'bg-transparent border-0 px-0 py-0 focus:ring-0')}
              placeholder="Сфера деятельности"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className={cardClass}>
        <h3 className={sectionTitleClass}>О нас</h3>
        <textarea
          value={companyData.description || ''}
          onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
          className={cn(inputClass, 'min-h-[120px] resize-none')}
          placeholder="Текстовое поле для описания компании, заполняемое вручную"
        />
      </section>

      {/* Location Section */}
      <section id="location" className={cardClass}>
        <h3 className={sectionTitleClass}>Где нас найти</h3>

        <div className="space-y-3 mb-4">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#5c5cc0] rounded-full flex-shrink-0" />
              <span className="text-[#6d69c2] flex-1">{link.text}</span>
              <button className="text-[#5c5cc0] hover:text-[#7373d2] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          className={inputClass}
          placeholder="Текстовое поле для ввода ссылки"
        />

        <button
          type="button"
          onClick={addSocialLink}
          className="mt-3 px-6 py-2.5 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                     hover:bg-[#7373d2] transition-colors"
        >
          Добавить ссылку
        </button>
      </section>

      {/* Events Section */}
      <section id="events" className={cardClass}>
        <h3 className={sectionTitleClass}>Наши мероприятия</h3>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-40 h-48 bg-[#c6def3] rounded-xl p-4 flex flex-col justify-end"
            >
              <div className="text-[#5f5ab4] text-sm font-medium">{event.title}</div>
              <div className="text-[#6d69c2] text-xs">{event.date}</div>
            </div>
          ))}
          <button className="flex-shrink-0 w-10 h-10 bg-[#5c5cc0] rounded-full flex items-center justify-center hover:bg-[#7373d2] transition-colors">
            <svg className="w-6 h-6 text-[#ecfffd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={addEvent}
          className="mt-4 px-6 py-2.5 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                     hover:bg-[#7373d2] transition-colors"
        >
          Добавить мероприятие
        </button>
      </section>

      {/* Vacancies Section */}
      <section id="vacancies" className={cardClass}>
        <h3 className={sectionTitleClass}>Наши вакансии</h3>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              className="flex-shrink-0 w-40 h-48 bg-[#c6def3] rounded-xl p-4 flex flex-col justify-end"
            >
              <div className="text-[#5f5ab4] text-sm font-medium">{vacancy.title}</div>
              <div className="text-[#6d69c2] text-xs">{vacancy.status}</div>
            </div>
          ))}
          <button className="flex-shrink-0 w-10 h-10 bg-[#5c5cc0] rounded-full flex items-center justify-center hover:bg-[#7373d2] transition-colors">
            <svg className="w-6 h-6 text-[#ecfffd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={addVacancy}
          className="mt-4 px-6 py-2.5 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                     hover:bg-[#7373d2] transition-colors"
        >
          Добавить вакансию
        </button>
      </section>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-[#f8d7da] border border-[#dc3545] rounded-lg text-[#721c24]">
          {error}
        </div>
      )}
    </ProfileLayout>
  );
};
