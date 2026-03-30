import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MapPage } from './pages/MapPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { useAuthStore } from './stores/authStore';

// Applicant pages
import {
  ApplicantDashboard,
  ApplicantProfile,
  ApplicantApplications,
  ApplicationDetail,
  ApplicantFavorites,
} from './pages/applicant';

// Employer pages
import {
  EmployerDashboard,
  EmployerCompanyProfile,
  EmployerOpportunities,
  EmployerApplications,
} from './pages/employer';

// Curator pages
import {
  CuratorDashboard,
  CuratorCompanies,
  CuratorOpportunities,
} from './pages/curator';

// Auth Guard Component
const AuthGuard = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'curator') return <Navigate to="/curator/dashboard" replace />;
    if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
    if (user.role === 'applicant') return <Navigate to="/applicant/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MapPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/map',
    element: <MapPage />,
  },
  
  // Applicant Routes
  {
    path: '/applicant',
    element: (
      <AuthGuard allowedRoles={['applicant']}>
        <DashboardLayout
          title="Личный кабинет соискателя"
          navigation={[
            { label: 'Главная', to: '/applicant/dashboard' },
            { label: 'Профиль', to: '/applicant/profile' },
            { label: 'Мои отклики', to: '/applicant/applications' },
            { label: 'Избранное', to: '/applicant/favorites' },
          ]}
        />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/applicant/dashboard" replace /> },
      { path: 'dashboard', element: <ApplicantDashboard /> },
      { path: 'profile', element: <ApplicantProfile /> },
      { path: 'applications', element: <ApplicantApplications /> },
      { path: 'applications/:applicationId', element: <ApplicationDetail /> },
      { path: 'favorites', element: <ApplicantFavorites /> },
    ],
  },
  
  // Employer Routes
  {
    path: '/employer',
    element: (
      <AuthGuard allowedRoles={['employer']}>
        <DashboardLayout
          title="Личный кабинет работодателя"
          navigation={[
            { label: 'Главная', to: '/employer/dashboard' },
            { label: 'Мои вакансии', to: '/employer/opportunities' },
            { label: 'Отклики', to: '/employer/applications' },
            { label: 'Профиль компании', to: '/employer/company' },
          ]}
        />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/employer/dashboard" replace /> },
      { path: 'dashboard', element: <EmployerDashboard /> },
      { path: 'opportunities', element: <EmployerOpportunities /> },
      { path: 'opportunities/new', element: <div className="p-6">Создание вакансии (в разработке)</div> },
      { path: 'opportunities/:id', element: <div className="p-6">Редактирование вакансии (в разработке)</div> },
      { path: 'applications', element: <EmployerApplications /> },
      { path: 'company', element: <EmployerCompanyProfile /> },
    ],
  },
  
  // Curator Routes
  {
    path: '/curator',
    element: (
      <AuthGuard allowedRoles={['curator']}>
        <DashboardLayout
          title="Панель куратора"
          navigation={[
            { label: 'Главная', to: '/curator/dashboard' },
            { label: 'Проверка компаний', to: '/curator/companies' },
            { label: 'Модерация вакансий', to: '/curator/opportunities' },
          ]}
        />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/curator/dashboard" replace /> },
      { path: 'dashboard', element: <CuratorDashboard /> },
      { path: 'companies', element: <CuratorCompanies /> },
      { path: 'companies/:id', element: <div className="p-6">Детали компании (в разработке)</div> },
      { path: 'opportunities', element: <CuratorOpportunities /> },
      { path: 'opportunities/:id', element: <div className="p-6">Детали вакансии (в разработке)</div> },
    ],
  },
  
  // 404 Route
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Страница не найдена</p>
          <a href="/" className="text-blue-600 hover:underline">Вернуться на главную</a>
        </div>
      </div>
    ),
  },
]);
