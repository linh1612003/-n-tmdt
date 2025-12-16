import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.svg';
import { IconButton, Menu as MaterialMenu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { logout } from '../../pages/Auth/userSlice';
import { useDispatch } from 'react-redux';
import NotificationBell from '../components/NotificationBell';

const { Header, Content, Footer, Sider } = Layout;

const AdminPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleUserClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        dispatch(logout());
        handleCloseMenu();
        navigate('/');
    };

    const handleUserInfo = () => {
        handleCloseMenu();
        navigate('/account');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={256} theme='dark' style={{ background: 'white' }}>
                <Menu
                    style={{ background: '' }}
                    mode='inline'
                    selectedKeys={[selectedKey]}
                    onClick={({ key }) => setSelectedKey(key)}
                >
                    <Menu.Item
                        key='/admin/products'
                        style={
                            selectedKey === '/admin/products'
                                ? { background: 'black', color: 'white' }
                                : {}
                        }
                    >
                        <Link to='/admin/products'>Quản lý sản phẩm</Link>
                    </Menu.Item>
                    {/* <Menu.Item
                        key='/admin/menu'
                        style={
                            selectedKey === '/admin/menu'
                                ? { background: 'black', color: 'white' }
                                : {}
                        }
                    >
                        <Link to='/admin/menu'>Quản lý menu</Link>
                    </Menu.Item> */}
                    <Menu.Item
                        key='/admin/categories'
                        style={
                            selectedKey === '/admin/categories'
                                ? { background: 'black', color: 'white' }
                                : {}
                        }
                    >
                        <Link to='/admin/categories'>Quản lý danh mục</Link>
                    </Menu.Item>
                    <Menu.Item
                        key='/admin/orders'
                        style={
                            selectedKey === '/admin/orders'
                                ? { background: 'black', color: 'white' }
                                : {}
                        }
                    >
                        <Link to='/admin/orders'>Quản lý đơn hàng</Link>
                    </Menu.Item>
                    <Menu.Item
                        key='/admin'
                        style={
                            selectedKey === '/admin' || selectedKey === '/admin/'
                                ? { background: 'black', color: 'white' }
                                : {}
                        }
                    >
                        <Link to='/admin'>Thống kê</Link>
                    </Menu.Item>
                    {/* Thêm các item khác nếu cần */}
                </Menu>
            </Sider>
            <Layout style={{ width: '', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Header style={{ background: '#fff', padding: 0, flexShrink: 0 }}>
                    <div
                        style={{
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <a
                            href='/'
                            className='wrapper__header__logo'
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '2rem', color: '#222' }}>
                                Hanie Jewelry
                            </span>
                        </a>
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <h1 style={{ fontFamily: 'monospace', margin: 0 }}>Admin </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <NotificationBell />
                            <IconButton
                                color='inherit'
                                onClick={handleUserClick}
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    </div>
                </Header>

                <Content style={{ 
                    margin: location.pathname === '/admin' || location.pathname === '/admin/' ? 0 : '0 16px', 
                    padding: location.pathname === '/admin' || location.pathname === '/admin/' ? 0 : 24, 
                    minHeight: location.pathname === '/admin' || location.pathname === '/admin/' ? 0 : 280, 
                    height: location.pathname === '/admin' || location.pathname === '/admin/' ? '100%' : 'auto',
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Outlet />
                </Content>
                {location.pathname !== '/admin' && location.pathname !== '/admin/' && (
                    <Footer style={{ textAlign: 'center', flexShrink: 0 }}>Admin  ©2024</Footer>
                )}
            </Layout>
            <MaterialMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleUserInfo}>Thông tin cá nhân</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Đăng xuất</MenuItem>
            </MaterialMenu>
        </Layout>
    );
};

export default AdminPage;
