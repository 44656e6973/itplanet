import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useApplicantStore } from '@/stores/applicantStore';
import type { UserUpdate } from '@/types/api';
import { ProfileLayout } from '@/components/layout/ProfileLayout';
import { cn } from '@/lib/utils';

export const ApplicantProfile = () => {
  const { user, fetchCurrentUser } = useAuthStore();
  const { updateProfile, profileLoading } = useApplicantStore();

  const [formData, setFormData] = useState<UserUpdate>({
    first_name: '',
    last_name: '',
    university: '',
    graduation_year: undefined,
    skills: [],
    social_links: {},
    privacy_settings: {},
  });

  const [bioDescription, setBioDescription] = useState('');
  const [originalData, setOriginalData] = useState<UserUpdate | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const sections = [
    { id: 'about', label: 'О нас' },
    { id: 'education', label: 'Образование' },
    { id: 'skills', label: 'Навыки' },
    { id: 'social', label: 'Социальные сети' },
    { id: 'privacy', label: 'Приватность' },
  ];

  useEffect(() => {
    if (user?.profile) {
      const profileData = {
        first_name: user.profile.first_name || '',
        last_name: user.profile.last_name || '',
        university: user.profile.university || '',
        graduation_year: user.profile.graduation_year || undefined,
        skills: user.profile.skills || [],
        social_links: user.profile.social_links || {},
        privacy_settings: user.profile.privacy_settings || {},
      };
      setFormData(profileData);
      setOriginalData(profileData);
      const bioValue = user.profile.privacy_settings?.bio;
      setBioDescription(typeof bioValue === 'string' ? bioValue : '');
    }
  }, [user]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateProfile(formData);
      await fetchCurrentUser();
      setOriginalData(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(s => s !== skillToRemove) || [],
    });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      social_links: {
        ...(formData.social_links || {}),
        [platform]: value,
      },
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setFormData({
      ...formData,
      privacy_settings: {
        ...(formData.privacy_settings || {}),
        [key]: value,
      },
    });
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const inputClass = cn(
    'w-full px-4 py-2.5 rounded-[12px] border-none bg-[var(--app-mint)]',
    'text-[#6d69c2] placeholder:text-[#9da3e4]',
    'focus:outline-none focus:ring-2 focus:ring-[#5c5cc0]',
    'transition-colors'
  );

  const labelClass = 'block text-sm font-medium text-[#6d69c2] mb-2';
  const sectionTitleClass = 'text-xl font-semibold text-[#6d69c2] mb-4';
  const cardClass = 'rounded-[14px] bg-[var(--app-card)] px-4 py-4 sm:px-6 sm:py-5 text-[#5f5ab4] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]';

  return (
    <ProfileLayout
      sections={sections}
      onSave={handleSubmit}
      onCancel={handleCancel}
      isSaving={isSaving || profileLoading}
      hasChanges={hasChanges}
    >
      {/* Header with Company Info */}
      <div className={cardClass}>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-[#c6def3] rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <input
              type="text"
              value={`${formData.last_name} ${formData.first_name}`}
              onChange={(e) => {
                const [lastName, ...firstNameParts] = e.target.value.split(' ');
                setFormData({
                  ...formData,
                  last_name: lastName || '',
                  first_name: firstNameParts.join(' ') || '',
                });
              }}
              className={cn(inputClass, 'text-lg font-medium bg-transparent border-0 px-0 py-0 focus:ring-0')}
              placeholder="ФИО"
            />
            <input
              type="text"
              value={formData.university || ''}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className={cn(inputClass, 'bg-transparent border-0 px-0 py-0 focus:ring-0')}
              placeholder="Место учебы / Должность"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className={cardClass}>
        <h3 className={sectionTitleClass}>О нас</h3>
        <textarea
          value={bioDescription}
          onChange={(e) => setBioDescription(e.target.value)}
          className={cn(inputClass, 'min-h-[120px] resize-none')}
          placeholder="Текстовое поле для описания, заполняемое вручную"
        />
      </section>

      {/* Education Section */}
      <section id="education" className={cardClass}>
        <h3 className={sectionTitleClass}>Образование</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>ВУЗ</label>
            <input
              type="text"
              value={formData.university || ''}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className={inputClass}
              placeholder="Например: МГУ им. Ломоносова"
            />
          </div>

          <div>
            <label className={labelClass}>Год выпуска</label>
            <select
              value={formData.graduation_year || ''}
              onChange={(e) => setFormData({
                ...formData,
                graduation_year: e.target.value ? Number(e.target.value) : undefined
              })}
              className={inputClass}
            >
              <option value="">Не указан</option>
              {graduationYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={cardClass}>
        <h3 className={sectionTitleClass}>Навыки</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            className={cn(inputClass, 'flex-1')}
            placeholder="Добавить навык"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-6 py-2.5 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                       hover:bg-[#7373d2] transition-colors"
          >
            Добавить
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills?.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#5c5cc0] text-[#ecfffd] rounded-lg text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-[#ff6b6b] transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Social Links Section */}
      <section id="social" className={cardClass}>
        <h3 className={sectionTitleClass}>Социальные сети</h3>

        <div className="space-y-3 mb-4">
          {['github', 'linkedin', 'telegram'].map((platform) => (
            <div key={platform} className="flex items-center gap-3">
              <span className="text-[#6d69c2] text-sm w-24 capitalize">{platform}</span>
              <input
                type="text"
                value={formData.social_links?.[platform as keyof typeof formData.social_links] || ''}
                onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                className={cn(inputClass, 'flex-1')}
                placeholder={`Ссылка на ${platform}`}
              />
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
          className="mt-3 px-6 py-2.5 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                     hover:bg-[#7373d2] transition-colors"
        >
          Добавить ссылку
        </button>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className={cardClass}>
        <h3 className={sectionTitleClass}>Приватность</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.privacy_settings?.public_profile || false}
              onChange={(e) => handlePrivacyChange('public_profile', e.target.checked)}
              className="w-5 h-5 rounded bg-[var(--app-mint)] border-[#5c5cc0] text-[#5c5cc0]
                         focus:ring-[#5c5cc0] focus:ring-offset-0"
            />
            <span className="text-[#6d69c2]">
              Публичный профиль (виден работодателям)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.privacy_settings?.show_contacts || false}
              onChange={(e) => handlePrivacyChange('show_contacts', e.target.checked)}
              className="w-5 h-5 rounded bg-[var(--app-mint)] border-[#5c5cc0] text-[#5c5cc0]
                         focus:ring-[#5c5cc0] focus:ring-offset-0"
            />
            <span className="text-[#6d69c2]">
              Показывать контакты (телефон, email)
            </span>
          </label>
        </div>
      </section>

      {/* Status Messages */}
      {saveSuccess && (
        <div className="p-4 bg-[#d4edda] border border-[#28a745] rounded-lg text-[#155724]">
          Профиль успешно обновлён!
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-[#f8d7da] border border-[#dc3545] rounded-lg text-[#721c24]">
          {saveError}
        </div>
      )}
    </ProfileLayout>
  );
};
