import { Content, Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName, SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem, Theme } from '@carbon/react';
import { IotConnect, Notification, Search, Template, User } from '@carbon/icons-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
    const location = useLocation();
    let isEditPage= location.pathname.includes('edit');

    let contentStyle = {}
    if (isEditPage) {
        contentStyle.marginLeft = '0';
        contentStyle.padding = '0';
    }

    return (
        <>
            <Theme theme="g100">
                <Header aria-label="IBM Platform Name">
                    <HeaderMenuButton aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'} onClick={() => setIsSideNavExpanded(!isSideNavExpanded)} isActive={isSideNavExpanded} aria-expanded={isSideNavExpanded} isCollapsible={isEditPage}/>
                    <HeaderName href="#" prefix="My">
                        IoT
                    </HeaderName>
                    <HeaderGlobalBar>
                        <HeaderGlobalAction aria-label="Search" >
                            <Search size={20} />
                        </HeaderGlobalAction>
                        <HeaderGlobalAction aria-label="Notifications" >
                            <Notification size={20} />
                        </HeaderGlobalAction>
                    </HeaderGlobalBar>


                    <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} onSideNavBlur={() => setIsSideNavExpanded(!isSideNavExpanded)} isFixedNav={isEditPage}>
                        <SideNavItems>
                            <SideNavMenu renderIcon={Template} title="Templates" tabIndex={0}>
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
            
            <Content className='content' style={contentStyle} children={<Outlet />} />

        </>
    );
}

export default MainLayout;