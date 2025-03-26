import { LucideIcon, SettingsIcon } from 'lucide-react';
import { Outlet, RouteObject, createBrowserRouter } from 'react-router-dom';

import Error403 from '@/403';
import ErrorPage from '@/components/error-page';
import { PERMISSIONS } from '@/constant';
import Layout from '@/layout';
import { Company } from '@/pages/company';
import { Dashboard } from '@/pages/dashboard';
import { DomainCheck } from '@/pages/domain-check';
import { Login } from '@/pages/login';
import { UserProfile } from '@/pages/user-profile';
import { AuthProvider, SignalRProvider } from '@/provider';
import { DomainProvider } from '@/provider/domain-provider';

import {
  ContractTaskManagementDataTable,
  ContractTaskManagementForm,
} from '@/pages/contract-task-management';

import { PermissionGroupsPage } from '@/pages/permission-groups';
import { UsersPage } from '@/pages/users';

type RouteObjectWithoutChildren = Omit<RouteObject, 'children'>;

export type CustomRouteType = RouteObjectWithoutChildren & {
  titleKey?: string;
  icon?: LucideIcon;
  hide?: boolean;
  permissions?: number[];
  children?: (RouteObjectWithoutChildren & CustomRouteType)[];
};

const routeConfig: CustomRouteType[] = [
  {
    element: (
      <DomainProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </DomainProvider>
    ),
    children: [
      {
        element: (
          <SignalRProvider hubUrl={`${import.meta.env.VITE_SIGNALR_HUB_URL}`}>
            <Outlet />
          </SignalRProvider>
        ),
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: '/',
                titleKey: 'home',
                permissions: [],
                element: <Dashboard />,
                hide: true,
              },
              {
                path: '/user-profile',
                element: <UserProfile />,
                titleKey: 'userProfile',
                permissions: [PERMISSIONS.USER_PROFILE],
                hide: true,
              },
              {
                path: '/system',
                titleKey: 'system.name',
                icon: SettingsIcon,
                permissions: [
                  PERMISSIONS.COMPANY,
                  PERMISSIONS.USER,
                  PERMISSIONS.PERMISSION_GROUP,
                  PERMISSIONS.DEPARTMENT,
                  PERMISSIONS.POSITION,
                  PERMISSIONS.APPROVAL_PROCESS,
                  PERMISSIONS.STATUS,
                  PERMISSIONS.FORM_DOCUMENT_MANAGER,
                ],
                children: [
                  {
                    titleKey: 'system.company',
                    path: '/system/company',
                    permissions: [PERMISSIONS.COMPANY],
                    element: <Company />,
                  },
                  {
                    path: '/system/permission-group',
                    titleKey: 'system.users.permissionGroups',
                    permissions: [PERMISSIONS.PERMISSION_GROUP],
                    element: <PermissionGroupsPage />,
                  },
                  {
                    titleKey: 'system.users.list',
                    path: '/system/users',
                    permissions: [PERMISSIONS.USER],
                    element: <UsersPage />,
                  },
                  {
                    path: '/system/task-management-contract',
                    titleKey: '/system/task-management-contract',
                    permissions: [PERMISSIONS.CONTRACT_TASK_MANAGEMENT],
                    children: [
                      {
                        path: '/system/task-management-contract',
                        permissions: [PERMISSIONS.CONTRACT_TASK_MANAGEMENT],
                        element: <ContractTaskManagementDataTable />,
                        hide: true,
                      },
                      {
                        path: '/system/task-management-contract/:id',
                        permissions: [PERMISSIONS.CONTRACT_TASK_MANAGEMENT],
                        element: <ContractTaskManagementForm />,
                        hide: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/sign-in',
        titleKey: 'login',
        element: <Login />,
        hide: true,
      },
      {
        path: '/check-domain/:type',
        titleKey: 'checkDomain',
        element: <DomainCheck />,
        hide: true,
      },
      {
        path: '/403',
        element: <Error403 />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
];

const routes = createBrowserRouter(routeConfig as RouteObject[]);

export default routes;
