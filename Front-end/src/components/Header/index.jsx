import { Badge, Box, IconButton, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle, Search, ShoppingCart, ArrowDropDown } from '@material-ui/icons';
import 'boxicons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cartsApi from '../../api/cartApi';
import categoryApi from '../../api/categoryApi';
import logo from '../../assets/logo/logo.svg';
import { logout } from '../../pages/Auth/userSlice';
import SearchComponent from '../../pages/Product/components/Search';
import '../Header/style.scss';
import { cartItemsCountSelector } from '../../pages/Cart/selectors';

function Header(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const [cartList, setCartList] = useState([]);
    const [userId, setUserId] = useState();
    const cartItemsCount = useSelector(cartItemsCountSelector);
    const [categories, setCategories] = useState([]);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role');
        if (userId) {
            setIsLoggedIn(true);
            setUserId(userId);
            if (userRole === 'admin') {
                setIsAdmin(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) {
            return;
        }
        (async () => {
            try {
                const cartList = await cartsApi.getAll(userId);
                setCartList(cartList);
            } catch (error) {
                console.log('Failed to fetch carts list', error);
            }
        })();
    }, [userId]);

    useEffect(() => {
        (async () => {
            try {
                const categoryList = await categoryApi.getAll();
                setCategories(categoryList);
            } catch (error) {
                console.log('Failed to fetch category list', error);
            }
        })();
    }, []);

    const handleSearchClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleUserClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        const action = logout();
        dispatch(action);
        setIsLoggedIn(false);
        handleCloseMenu();
        navigate('/');
    };

    const handleAdminClick = () => {
        navigate('/admin');
    }
    const handleUserInfo = () => {
        navigate('/account');
    };
    const handleShop = () => {
        navigate('/order-history');
    };

    const handleCategoryClick = (e) => {
        setCategoryAnchorEl(e.currentTarget);
    };

    const handleCategoryClose = () => {
        setCategoryAnchorEl(null);
    };

    const handleCategorySelect = (categoryId) => {
        navigate(`/products?categoryId=${categoryId}`);
        handleCategoryClose();
    };

    return (
        <div className='wrapper__header'>
            <a
                href='/'
                className='wrapper__header__logo'
            >
                <span className='header-logo-text' style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '2rem', color: '#222' }}>
                    Hanie Jewelry
                </span>
            </a>

            <nav className='wrapper__header__navbar'>
                <a
                    style={{ '--i': 1 }}
                    href='/products'
                    className='active'
                >
                    SẢN PHẨM
                </a>
                <Box
                    component="a"
                    style={{ '--i': 2, cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                    onClick={handleCategoryClick}
                >
                    DANH MỤC
                    <ArrowDropDown />
                </Box>
                <a
                    style={{ '--i': 3 }}
                    href='http://localhost:3000/products?promotion=true'
                >
                    KHUYẾN MÃI
                </a>
                <a
                    style={{ '--i': 4 }}
                    href='/about'
                >
                    VỀ CHÚNG TÔI
                </a>
            </nav>

            <div className='wrapper__header__social-media'>
                {isLoggedIn ? (
                    <Box>
                        {isAdmin ? (
                            <>
                                <IconButton
                                    size='large'
                                    color='inherit'
                                    onClick={handleAdminClick}
                                >
                                    <box-icon type='solid' name='lock-alt'></box-icon>
                                </IconButton>
                                <IconButton
                                    color='inherit'
                                    onClick={handleUserClick}
                                >
                                    <AccountCircle />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    size='large'
                                    color='inherit'
                                    onClick={handleSearchClick}
                                >
                                    <Search />
                                </IconButton>
                                <IconButton
                                    size='large'
                                    color='inherit'
                                    onClick={handleCartClick}
                                >
                                    <Badge
                                        badgeContent={cartItemsCount}
                                        color='error'
                                    >
                                        <ShoppingCart style={{ color: 'black' }} />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    color='inherit'
                                    onClick={handleUserClick}
                                >
                                    <AccountCircle />
                                </IconButton>
                            </>
                        )}
                    </Box>
                ) : (
                    <>
                        <a
                            style={{ '--i': 2 }}
                                href='https://www.facebook.com/moc.thien.1401'
                        >
                            <box-icon
                                type='logo'
                                name='facebook-circle'
                                color='#000'
                            ></box-icon>
                        </a>
                        <a
                            style={{ '--i': 3 }}
                                href='https://www.instagram.com/haniepham06?igsh=cHFmZG80eTY4Njh4&utm_source=qr'
                        >
                            <box-icon
                                type='logo'
                                name='instagram-alt'
                                color='#000'
                            ></box-icon>
                        </a>
                        <a
                            style={{ '--i': 4 }}
                            href='/login'
                        >
                            <box-icon
                                type='solid'
                                name='user-circle'
                                color='#000'
                            ></box-icon>
                        </a>
                    </>
                )}
            </div>

            <div className={`search-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                <SearchComponent />
            </div>
            <Menu
                keepMounted
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
                getContentAnchorEl={null}
            >
                <MenuItem onClick={handleUserInfo}>Thông tin cá nhân</MenuItem>
                <MenuItem onClick={handleShop}>Đơn mua</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Đăng xuất</MenuItem>
            </Menu>
            <Menu
                keepMounted
                anchorEl={categoryAnchorEl}
                open={Boolean(categoryAnchorEl)}
                onClose={handleCategoryClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                getContentAnchorEl={null}
            >
                {categories.map((category) => (
                    <MenuItem
                        key={category._id}
                        onClick={() => handleCategorySelect(category._id)}
                    >
                        {category.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default Header 