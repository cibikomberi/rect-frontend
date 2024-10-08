import { Content, Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName, SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem, Theme } from '@carbon/react';
import { Fade, Notification, Search } from '@carbon/icons-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
    const location = useLocation();
    let isEditPage= location.pathname.includes('edit');

    let contentStyle = {}
    if (isEditPage) {
        contentStyle.marginLeft = '0'
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
                            <SideNavMenu renderIcon={Fade} title="Templates" tabIndex={0}>
                                <SideNavMenuItem as={Link} to="/my-templates">
                                    My Templates
                                </SideNavMenuItem>
                                <SideNavMenuItem as={Link} to="/templates">
                                    Pre - generated
                                </SideNavMenuItem>
                            </SideNavMenu>
                            <SideNavLink renderIcon={Fade} as={Link} to="/devices">
                                Devices
                            </SideNavLink>
                            <SideNavLink renderIcon={Fade} href="https://www.carbondesignsystem.com/">
                                Link
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