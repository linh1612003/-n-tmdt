import { Badge, Box, IconButton, Menu, MenuItem } from '@material-ui/core';
<<<<<<< HEAD
import { AccountCircle, Search, ShoppingCart } from '@material-ui/icons';
=======
import { AccountCircle, Search, ShoppingCart, ArrowDropDown } from '@material-ui/icons';
>>>>>>> origin/back-up
import 'boxicons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cartsApi from '../../api/cartApi';
<<<<<<< HEAD
=======
import categoryApi from '../../api/categoryApi';
>>>>>>> origin/back-up
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
<<<<<<< HEAD
    // Tính số lượng sản phẩm (items) còn hợp lệ trong giỏ của user hiện tại
    // Chỉ đếm item còn quantity > 0 và còn product (đã xóa/thanh toán thì bỏ qua)
    const cartItemsCount = (cartList || [])
        .filter((item) => (item?.quantity || 0) > 0 && item?.product?.length > 0)
        .length;
=======
    const cartItemsCount = useSelector(cartItemsCountSelector);
    const [categories, setCategories] = useState([]);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
>>>>>>> origin/back-up

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

<<<<<<< HEAD
    const loadCartList = async () => {
        if (!userId) {
            return;
        }
        try {
            const cartList = await cartsApi.getAll(userId);
            setCartList(cartList || []);
        } catch (error) {
            console.log('Failed to fetch carts list', error);
            setCartList([]);
        }
    };

    useEffect(() => {
        loadCartList();
    }, [userId]);

    // Reload cart khi navigate về trang chủ hoặc khi có thay đổi
    useEffect(() => {
        const handleFocus = () => {
            if (userId) {
                loadCartList();
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [userId]);

=======
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

>>>>>>> origin/back-up
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

<<<<<<< HEAD
=======
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

>>>>>>> origin/back-up
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
<<<<<<< HEAD
                <a
                    style={{ '--i': 2 }}
=======
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
>>>>>>> origin/back-up
                    href='http://localhost:3000/products?promotion=true'
                >
                    KHUYẾN MÃI
                </a>
<<<<<<< HEAD
                {/* <a
                    style={{ '--i': 3 }}
                    href='http://localhost:3000/products?_limit=16&_page=1&_sort=asc&categoryId=6749e63a24417ea8e0551c35'
                >
                    Pre-order
                </a> */}
=======
>>>>>>> origin/back-up
                <a
                    style={{ '--i': 4 }}
                    href='/about'
                >
                    VỀ CHÚNG TÔI
                </a>
<<<<<<< HEAD
                {/* <a
                    style={{ '--i': 5 }}
                    href='/blog'
                >
                    BLOG
                </a> */}
=======
>>>>>>> origin/back-up
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
<<<<<<< HEAD
                            href='https://www.facebook.com/moc.thien.1401'
=======
                                href='https://www.facebook.com/moc.thien.1401'
>>>>>>> origin/back-up
                        >
                            <box-icon
                                type='logo'
                                name='facebook-circle'
                                color='#000'
                            ></box-icon>
                        </a>
                        <a
                            style={{ '--i': 3 }}
<<<<<<< HEAD
                            href='https://www.instagram.com/haniepham06?igsh=cHFmZG80eTY4Njh4&utm_source=qr'
=======
                                href='https://www.instagram.com/haniepham06?igsh=cHFmZG80eTY4Njh4&utm_source=qr'
>>>>>>> origin/back-up
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
<<<<<<< HEAD
                <SearchComponent onClose={() => setIsDropdownOpen(false)} />
=======
                <SearchComponent />
>>>>>>> origin/back-up
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
<<<<<<< HEAD
=======
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
>>>>>>> origin/back-up
        </div>
    );
}

export default Header 