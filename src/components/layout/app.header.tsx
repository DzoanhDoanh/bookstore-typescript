import { useEffect, useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover, App, Empty, Button } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import { getCartsApi } from '@/services/api';

interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
}
const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const { message } = App.useApp();

    const { isAuthenticated, user, setUser, setIsAuthenticated, carts, setCarts } = useCurrentApp();

    const navigate = useNavigate();
    useEffect(() => {
        const fetchCarts = async () => {
            if (isAuthenticated === true) {
                const res = await getCartsApi();
                if (res && res.data) {
                    setCarts(res.data);
                }
            } else {
                setCarts([]);
            }
        };
        fetchCarts();
    }, [isAuthenticated]);
    const handleLogout = async () => {
        setUser(null);
        setCarts([]);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
        message.success('Đăng xuất thành công!');
    };
    // eslint-disable-next-line prefer-const
    let items = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => navigate('/account/1')}>
                    Quản lý tài khoản
                </label>
            ),
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];
    if (user?.role === 'admin') {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin',
        });
    }

    const contentPopover = () => {
        return (
            <div className="pop-cart-body">
                <div className="pop-cart-content">
                    {carts?.map((book, index) => {
                        return (
                            <div className="book" key={`book-${index}`}>
                                <img src={`${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className="price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        book?.detail?.price ?? 0,
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {carts.length > 0 ? (
                    <div style={{ display: 'flex', gap: 12, marginTop: '20px' }}>
                        <Button type="primary" onClick={() => navigate('/order')}>
                            Xem giỏ hàng
                        </Button>
                    </div>
                ) : (
                    <Empty description="Không có sản phẩm trong giỏ hàng" />
                )}
            </div>
        );
    };
    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div
                            className="page-header__toggle"
                            onClick={() => {
                                setOpenDrawer(true);
                            }}
                        >
                            ☰
                        </div>
                        <div className="page-header__logo">
                            <span className="logo">
                                <span onClick={() => navigate('/')}>
                                    {' '}
                                    <FaReact className="rotate icon-react" />
                                    BookStore
                                </span>

                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input
                                className="input-search"
                                type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                value={props.searchTerm}
                                onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={'Sản phẩm mới thêm'}
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge count={carts?.length ?? 0} size={'small'} showZero>
                                        <FiShoppingCart className="icon-cart" onClick={() => navigate('/order')} />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                ) : (
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space>
                                            <Avatar src={`http://localhost:5173/src/assets/images/${user?.avatar}`} />
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer title="Menu chức năng" placement="left" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <p>Quản lý tài khoản</p>
                <Divider />

                <p onClick={() => handleLogout()}>Đăng xuất</p>
                <Divider />
            </Drawer>
        </>
    );
};

export default AppHeader;
