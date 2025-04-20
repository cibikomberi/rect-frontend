import { Dashboard, IotConnect, Template, UserAvatarFilled, UserMultiple } from '@carbon/icons-react';
import { Content, Dropdown, Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton, HeaderName, Loading, MenuButton, MenuItem, SideNav, SideNavItems, SideNavLink, SideNavMenu, SideNavMenuItem, Theme } from '@carbon/react';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { DashboardContext } from './DashboardContext';

const resolutions = ['Mobile: 600px', 'Tablet: 768px', 'Desktop: 1024px', 'Large: 1440px'];
const MainLayout = () => {
  const { saveData, resolution, setResolution } = useContext(DashboardContext);
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  let isEditPage = (location.pathname.includes("dashboard") && (location.pathname.includes("view") || location.pathname.includes("edit")));
  let isDashboardEditPage = (location.pathname.includes("dashboard") && location.pathname.includes("edit"));
  let isDashboardPage = (location.pathname.includes("dashboard") && location.pathname.includes("view"));
  const currentPath = location.pathname.split("/")[1];
  const sharedPath = location.pathname.split("/")[2];

  useEffect(() => {
    axios.get('/whoami').then(res => res.data)
      .then(async (profile) => {
        if (profile.imageUrl) {
          setProfileImage(profile.imageUrl);
          return;
        }
        if (profile.imageId === null) {
          return;
        }
        const image = await axios.get(`/profile/image/${profile.imageId}`, { responseType: "blob" }).then(res => res.data)
        setProfileImage(URL.createObjectURL(image));
      }).catch(err => {
        if (isDashboardPage) {
          return;
        }
        navigate('/login');
      });
  }, []);


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
          <HeaderName prefix="">
            Rect
          </HeaderName>
          <HeaderGlobalBar>

            {/* <HeaderGlobalAction aria-label="Search">
              <Search size={20} />
            </HeaderGlobalAction> */}
            {isDashboardEditPage ? <div style={{ display: 'flex', alignItems: "center" }}>
              <Dropdown
                autoAlign
                type='inline'
                id="datastream-type-input"
                label="Screen Width"
                titleText="Screen Width"
                selectedItem={resolution}
                onChange={(e) => setResolution(e.selectedItem)}
                items={resolutions}
              />
              <MenuButton label='Deploy' size='sm' style={{ marginRight: "15px" }}>
                <MenuItem onClick={() => saveData(1, sharedPath)} label="1 Day" />
                <MenuItem onClick={() => saveData(30, sharedPath)} label="1 Month" />
                <MenuItem onClick={() => saveData(180, sharedPath)} label="6 Months" />
              </MenuButton></div> :
              <HeaderGlobalAction aria-label="Profile" as={Link} to="/profile">
                {profileImage ? <img src={profileImage} alt='profile-image' className='img-view' style={{ width: "36px", height: "36px", margin: "0px" }} /> : <UserAvatarFilled size={20} />}
              </HeaderGlobalAction>
            }
          </HeaderGlobalBar>

          <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            onSideNavBlur={() => setIsSideNavExpanded(!isSideNavExpanded)}
            isFixedNav={isEditPage}
          >
            <SideNavItems>
              <SideNavLink renderIcon={Dashboard} as={Link} to="/dashboard" isActive={currentPath === "dashboard"}>
                Dashboards
              </SideNavLink>
              <SideNavLink renderIcon={Template} as={Link} to="/templates" isActive={currentPath === "templates"}>
                Templates
              </SideNavLink>
              <SideNavLink renderIcon={IotConnect} as={Link} to="/devices" isActive={currentPath === "devices"}>
                Devices
              </SideNavLink>
              <SideNavMenu renderIcon={UserMultiple} title="Shared with me">
                <SideNavMenuItem as={Link} to="/shared/dashboards" isActive={sharedPath === "dashboards"}>
                  Dashboards
                </SideNavMenuItem>
                <SideNavMenuItem as={Link} to="/shared/templates" isActive={sharedPath === "templates"}>
                  Templates
                </SideNavMenuItem>
                <SideNavMenuItem as={Link} to="/shared/devices" isActive={sharedPath === "devices"}>
                  Devices
                </SideNavMenuItem>
              </SideNavMenu>
            </SideNavItems>
          </SideNav>
        </Header>
      </Theme>

      <Content
        className="content"
        style={contentStyle}
        children={
          navigation.state === "loading" ? (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Loading small withOverlay={false} />
            </div>
          ) : (
            <Outlet />
          )
        }
      />
    </>
  );
}

export default MainLayout;