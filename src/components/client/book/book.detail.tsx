import { Row, Col, Typography, Rate, Tag, Button, InputNumber, Card, Image, message, Spin } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CurrencyFormatter from '@/components/currencyFormatter/CurrencyFormatter';
import { useState } from 'react';
import { useCurrentApp } from '@/components/context/app.context';
import { addToCartApi, getCartsApi } from '@/services/api';

const { Title, Text, Paragraph } = Typography;

interface IProps {
    currentBook: IBook | undefined;
}
const BookDetail = ({ currentBook }: IProps) => {
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const { setCarts } = useCurrentApp();
    const navigate = useNavigate();
    const handleAddToCart = async () => {
        try {
            setLoading(true);
            const fetchCarts = await getCartsApi();
            if (fetchCarts && fetchCarts.data) {
                const data = fetchCarts.data;
                const isExistBook = data.findIndex((c: ICart) => c.detail.id === (currentBook ? currentBook.id : ''));
                if (isExistBook > -1) {
                    message.warning('Sản phẩm đã có trong giỏ hàng.');
                    setLoading(false);
                    return;
                }
            }
            const res = await addToCartApi(currentQuantity, currentBook as IBook);
            if (res && res.status === 201 && res.data) {
                const fetchCarts = await getCartsApi();
                if (fetchCarts && fetchCarts.data) {
                    setCarts(fetchCarts.data);
                }
                message.success('Thêm vào giỏ hàng thành công');
                setLoading(false);
            } else {
                message.error('Không thể thêm sản phẩm vào giỏ hàng');
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            message.error('Không thể thêm sản phẩm vào giỏ hàng');
            setLoading(false);
        }
    };
    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 0' }}>
            {loading ? (
                <Spin fullscreen></Spin>
            ) : (
                <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 24 }}>
                    <Row gutter={[32, 32]} align="top">
                        <Col xs={18} md={8}>
                            <img
                                src={currentBook ? currentBook.thumbnail : ''}
                                alt="Book Cover"
                                style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
                            />
                            <Row gutter={[16, 16]}>
                                {currentBook ? (
                                    currentBook.slider.map((item) => {
                                        return (
                                            <Col key={item} xs={0} md={6}>
                                                <Image src={item} alt={'slider'} />
                                            </Col>
                                        );
                                    })
                                ) : (
                                    <></>
                                )}
                            </Row>
                        </Col>
                        <Col xs={0} md={1}></Col>
                        <Col xs={24} md={14}>
                            <a
                                href="#"
                                onClick={() => navigate('/')}
                                style={{ display: 'inline-block', marginBottom: 16 }}
                            >
                                <ArrowLeftOutlined /> Quay lại danh sách
                            </a>
                            <Title level={3}>{currentBook?.mainText}</Title>
                            <Text type="secondary">{currentBook?.author}</Text>
                            <div style={{ margin: '8px 0' }}>
                                <Rate allowHalf defaultValue={4.5} disabled /> <Text>(4.5)</Text>
                            </div>
                            <Paragraph style={{ maxWidth: 600 }}>
                                <b>Vận chuyển:</b> Miễn phí vận chuyển
                            </Paragraph>
                            <div style={{ marginBottom: 12 }}>
                                <Tag color="blue">Programming</Tag>
                                <Tag color="purple">Best Seller</Tag>
                                <Tag color="cyan">Agile</Tag>
                            </div>
                            <div style={{ lineHeight: 2 }}>
                                <Text>
                                    <b>Danh mục:</b> {currentBook?.category}
                                </Text>
                                <br />
                                <Text>
                                    <b>Nhà xuất bản:</b> {currentBook?.author}
                                </Text>
                                <br />
                                <Text>
                                    <b>Số lượng hiện có:</b> {currentBook?.quantity}
                                </Text>
                                <br />
                                <Text>
                                    <b>Đã bán:</b> {currentBook?.sold}
                                </Text>
                            </div>
                            <Title level={3} style={{ color: '#d4380d', marginTop: 16 }}>
                                <CurrencyFormatter value={currentBook ? currentBook.price : 0} />
                            </Title>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <Text>Số lượng:</Text>
                                <InputNumber
                                    min={1}
                                    value={currentQuantity}
                                    max={currentBook?.quantity}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onChange={(value) => setCurrentQuantity(value ?? 1)}
                                />
                            </div>
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                style={{ marginRight: '10px' }}
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            <Button type="primary" icon={<ShoppingCartOutlined />}>
                                Mua ngay
                            </Button>
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default BookDetail;
