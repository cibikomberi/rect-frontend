import { Content, Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName, Loading, SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem, Theme } from '@carbon/react';
import { Dashboard, IotConnect, Notification, Search, Template, User } from '@carbon/icons-react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigation } from 'react-router-dom';

const MainLayout = () => {
    const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
    const location = useLocation();
    const navigation = useNavigation();
    let isEditPage = location.pathname.includes("edit") || location.pathname.includes("dashboard");

    let contentStyle = {
        overflow: 'auto'
    }
    if (isEditPage) {
        contentStyle.marginLeft = '0';
        contentStyle.padding = '0';
    }

    return (
      <>
        <Theme theme="g100" style={{ scrollbarWidth: "thin" }}>
          <Header aria-label="Rect Platform Name">
            <HeaderMenuButton
              aria-label={isSideNavExpanded ? "Close menu" : "Open menu"}
              onClick={() => setIsSideNavExpanded(!isSideNavExpanded)}
              isActive={isSideNavExpanded}
              aria-expanded={isSideNavExpanded}
              isCollapsible={isEditPage}
            />
            <HeaderName href="#" prefix="">
              Rect
            </HeaderName>
            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label="Search">
                <Search size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="Notifications">
                <Notification size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>

            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              onSideNavBlur={() => setIsSideNavExpanded(!isSideNavExpanded)}
              isFixedNav={isEditPage}
            >
              <SideNavItems>
                <SideNavLink renderIcon={Dashboard} as={Link} to="/dashboard">
                  Dashboards
                </SideNavLink>
                <SideNavMenu
                  renderIcon={Template}
                  title="Templates"
                  tabIndex={0}
                >
                  <SideNavMenuItem as={Link} to="/templates">
                    My Templates
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavLink renderIcon={IotConnect} as={Link} to="/devices">
                  Devices
                </SideNavLink>
                <SideNavLink renderIcon={User} href="/users">
                  Users
                </SideNavLink>
              </SideNavItems>
            </SideNav>
          </Header>
        </Theme>

        <Content
          className="content"
          style={contentStyle}
          children={
            navigation.state === "loading" ? (
                <Loading withOverlay={true} small />
            ) : (
              <Outlet />
            )
          }
        />
      </>
    );
}

export default MainLayout;