import routes, { CustomRouteType } from '@/router/routes';

import { useNav } from '@/hooks/use-nav';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { RouteObject, matchRoutes, useLocation } from 'react-router-dom';
import { SideBarContainer } from './sidebar-container';
import { SidebarHeader } from './sidebar-header';
import { SidebarItem, getSubItems } from './sidebar-item';

export const SideBar = () => {
  const { t } = useTranslation('navigation');

  const location = useLocation();
  const { isExpanded } = useNav();

  const layout = routes.routes[0].children?.[0].children?.[0] as CustomRouteType;
  const menuItems = getSubItems(layout);
  const matchesRoute = matchRoutes(layout.children as RouteObject[], location);

  const routeData = matchesRoute?.find(x => x.route.path === location.pathname)
    ?.route as RouteObject & { titleKey: string };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{t(routeData?.titleKey)}</title>
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <SideBarContainer>
        <div className="overflow-y-auto bg-[#DEE1E6FF]">
          <SidebarHeader />
          <div
            className={cn('flex flex-col overflow-y-auto px-0.5', isExpanded ? '' : '')}
            style={{ height: 'calc(100vh - 80px)' }}
          >
            {menuItems?.map(menuItem => <SidebarItem key={menuItem.id} item={menuItem} />)}
          </div>
        </div>
      </SideBarContainer>
    </>
  );
};
