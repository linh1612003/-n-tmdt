import { Pagination, Spin } from 'antd';
import queryString from 'query-string';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productsApi from '../../../api/productApi';
import FilterViewer from '../components/FilterViewer';
import ProductFilter from '../components/ProductFilter';
import ProductList from '../components/ProductList';
import ProductSort from '../components/ProductSort';
import ProductError from '../components/ProductError';
import './style.scss';
import slideImage from '../../../assets/images/Slide4.png';
import Slideshow from '../../../components/Slideshow';
import { Typography } from '@material-ui/core';
import ProductClear from '../components/ProductClear';
import ProductType from '../components/Type/ProductType';

function ListPage(props) {
    const [productList, setProductList] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search);
        return {
            ...params,
            _page: Number.parseInt(params._page) || 1,
            _limit: Number.parseInt(params._limit) || 16,
            _sort: params._sort || 'asc',
        };
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (queryParams.promotion === 'true') {
                    // Lấy toàn bộ sản phẩm, không phân trang, để lọc khuyến mãi đúng
                    const data = await productsApi.getAllRaw();
                    const saleProducts = data.filter(p => p.originalPrice > p.salePrice);
                    setProductList(saleProducts);
                    setTotalProducts(saleProducts.length);
                } else {
                    const data = await productsApi.getAll(queryParams);
                    setProductList(data.rows || data);
                    setTotalProducts(data.totalProducts || (data.rows ? data.rows.length : data.length));
                }
                setFetchError(false);
            } catch (error) {
                console.log('Failed to get all products:', error);
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [queryParams]);

    const handleSortChange = (newSortValue) => {
        const filters = {
            ...queryParams,
            _sort: newSortValue,
        };

        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filters),
        });
    };

    const handleFiltersChange = (newFilters) => {
        // Chuyển các filter dạng mảng thành chuỗi để truyền qua URL
        const filters = {
            ...queryParams,
            ...newFilters,
            materials: Array.isArray(newFilters.materials) ? newFilters.materials.join(',') : newFilters.materials,
            gemstones: Array.isArray(newFilters.gemstones) ? newFilters.gemstones.join(',') : newFilters.gemstones,
            priceRanges: Array.isArray(newFilters.priceRanges) ? newFilters.priceRanges.join(',') : newFilters.priceRanges,
            genders: Array.isArray(newFilters.genders) ? newFilters.genders.join(',') : newFilters.genders,
            _page: 1, // reset về trang 1 khi filter
        };

        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filters),
        });
    };

    const handleCategoryChange = (newCategoryAvailabilityStatus) => {
        const filters = {
            ...queryParams,
            typeId: newCategoryAvailabilityStatus,
        };

        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filters),
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='wrapper__product'>
                <div className='wrapper__product__filter'>
                    {/* <ProductFilter
                        filters={queryParams}
                        onChange={handleFiltersChange}
                    /> */}
                </div>
                <div className='wrapper__product__productList'>
                    {loading ? (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '20px',
                                height: '800px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Spin
                                size='large'
                                style={{
                                    fontSize: '48px',
                                    color: '#000',
                                }}
                            />
                        </div>
                    ) : fetchError ? (
                        <ProductError />
                    ) : (
                        <div>
                            {/* <div className='wrapper__product__productList_type'>
                                <ProductType
                                    filters={queryParams}
                                    onChange={handleCategoryChange}
                                />
                            </div> */}
                            <div
                                className='wrapper__product__productList__filterViewer'
                                style={{ display: 'flex', marginBottom: '10px' }}
                            >
                                <FilterViewer
                                    filters={queryParams}
                                    onChange={handleFiltersChange}
                                />
                                <ProductSort
                                    currentSort={queryParams._sort}
                                    onChange={handleSortChange}
                                />
                            </div>
                            <div className='wrapper__product__productList__products'>
                                {productList && productList.length > 0 ? (
                                    <>
                                        <ProductList data={productList} />
                                        <Pagination
                                            className='custom-pagination'
                                            align='center'
                                            current={Number.parseInt(queryParams._page)}
                                            total={totalProducts}
                                            pageSize={queryParams._limit}
                                            onChange={(page) =>
                                                handleFiltersChange({ _page: page })
                                            }
                                        />
                                    </>
                                ) : (
                                    <ProductClear />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                className='wrapper__slide'
                style={{ height: '100px', borderBottom: '1px solid black' }}
            >
                <img
                    src={slideImage}
                    alt='Slide'
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div className='wrapper__middle'>
                <Typography
                    variant='h5'
                    style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                >
                    HANIE JEWELRY - TRANG SỨC CAO CẤP
                </Typography>
                <Typography style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    "Tỏa sáng cùng đẳng cấp - Gắn kết yêu thương"
                </Typography>
            </div>
            <Slideshow />
        </div>
    );
}

ListPage.propTypes = {
    // Define prop types if any
};

export default ListPage;
