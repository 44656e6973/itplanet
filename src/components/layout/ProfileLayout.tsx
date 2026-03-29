import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProfileSection {
  id: string;
  label: string;
}

interface ProfileLayoutProps {
  sections: ProfileSection[];
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export const ProfileLayout = ({
  sections,
  children,
  onSave,
  onCancel,
  isSaving = false,
  hasChanges = false,
}: ProfileLayoutProps) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-white">
      <div className="mx-auto max-w-[1108px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-56 flex-shrink-0">
            <nav className="sticky top-6 rounded-[14px] bg-[var(--app-card)] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                        activeSection === section.id
                          ? 'bg-[#5c5cc0] text-[#ecfffd]'
                          : 'text-[#6d69c2] hover:bg-[var(--app-mint)] hover:text-[#5f5ab4]'
                      )}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {children}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[#2e303a]/30">
              <button
                onClick={onSave}
                disabled={isSaving || !hasChanges}
                className="flex-1 px-6 py-3 bg-[#5c5cc0] text-[#ecfffd] rounded-lg font-medium
                           hover:bg-[#7373d2] disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
              <button
                onClick={onCancel}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[var(--app-mint)] text-[#6d69c2] rounded-lg font-medium
                           hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                Отменить изменения
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
