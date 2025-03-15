import { deleteUserApi, getBooksApi } from '@/services/api';
// import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.book';
import CreateUser from './create.book';
// import ImportUser from './data/import.user';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.book';
import dayjs from 'dayjs';
import DetailBook from './detail.book';
import CreateBook from './create.book';
import UpdateBook from './update.book';
import CurrencyFormatter from '@/components/currencyFormatter/CurrencyFormatter';

type TSearch = {
    mainText: string;
    author: string;
    createAt: string;
    createAtRange: string;
};
const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBook | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IBook[]>([]);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBook | null>(null);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDeleteBook = async (id: string) => {
        // setIsDeleteUser(false);
        const res = await deleteUserApi(id);
        console.log(res);
        setTimeout(() => {
            if (res && res.data && typeof res.data === 'string') {
                const alertMessage = res.data + '';
                notification.error({
                    message: 'Has an error!',
                    description: alertMessage,
                });
                setIsDeleteBook(true);
                return;
            } else {
                message.success('Delete user success!');
                setIsDeleteBook(false);
                refreshTable();
            }
        }, 500);
    };
    const columns: ProColumns<IBook>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true,
            sorter: true,
            render(dom, entity) {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                        href="#"
                    >
                        {entity.id}
                    </a>
                );
            },
        },
        {
            title: 'Book name',
            dataIndex: 'mainText',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            hideInSearch: false,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            hideInSearch: true,
            render(dom, entity) {
                return <CurrencyFormatter value={entity.price} />;
            },
        },
        {
            title: 'CreateAt',
            dataIndex: 'createAt',
            valueType: 'date',
            hideInSearch: true,
            render(dom, entity) {
                return <>{dayjs(entity.createAt).format('DD-MM-YYYY')}</>;
            },
        },
        {
            title: 'Create At',
            dataIndex: 'createAtRange',
            valueType: 'dateRange',
            sorter: true,
            hideInTable: true,
            hideInSearch: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor={'#f57800'}
                            style={{ cursor: 'pointer', marginRight: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={'Delete book'}
                            description="Are you sure to delete this book?"
                            onConfirm={() => handleDeleteBook(entity.id)}
                            okText="Confirm"
                            cancelText="Cancel"
                            okButtonProps={{ loading: isDeleteBook }}
                        >
                            <span style={{ cursor: 'pointer', marginLeft: '20px' }}>
                                <DeleteTwoTone twoToneColor={'#ff4d4f'} style={{ cursor: 'pointer' }} />
                            </span>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    };
    return (
        <>
            <ProTable<IBook, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = '';
                    if (params) {
                        if (params.mainText) {
                            query += `&mainText_like=${params.mainText}`;
                        }
                        if (params.author) {
                            query += `&author_like=${params.author}`;
                        }
                        // const createDateRange = dateRangeValidate(params.createAtRange);
                        // if (createDateRange) {
                        //     query += `&createAt>=${createDateRange[0]}&createAt<=${createDateRange[1]}`;
                        // }
                    }

                    if (sort && sort.id) {
                        const sortBy = sort.id === 'ascend' ? 'asc' : 'desc';
                        query += `&_sort=id&_order=${sortBy}`;
                    }
                    const allBook = await getBooksApi(query);
                    if (allBook && typeof allBook.data !== 'string') {
                        setCurrentDataTable(allBook.data);
                    }
                    return {
                        data: allBook.data,
                        page: 1,
                        success: true,
                        // total: 3,
                    };
                }}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                    onChange: (page) => console.log(page),
                }}
                headerTitle="Table book"
                toolBarRender={() => [
                    <Button icon={<ExportOutlined />} type="primary">
                        <CSVLink data={currentDataTable} filename="export-user.csv">
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => {
                            setOpenModalImport(true);
                        }}
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,
                ]}
            />
            <DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            {/* <ImportUser openModalImport={openModalImport} setOpenModalImport={setOpenModalImport} /> */}
            <UpdateBook
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TableBook;
