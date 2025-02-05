import { getUsersApi } from '@/services/api';
// import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import CreateUser from './create.user';

type TSearch = {
    fullName: string;
    email: string;
    createAt: string;
    createAtRange: string;
};
const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUser | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const columns: ProColumns<IUser>[] = [
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
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            hideInSearch: true,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            hideInSearch: true,
        },
        {
            title: 'CreateAt',
            dataIndex: 'createAt',
            valueType: 'date',
            hideInSearch: true,
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
            render() {
                return (
                    <>
                        <EditTwoTone twoToneColor={'#f57800'} style={{ cursor: 'pointer', marginRight: 15 }} />
                        <DeleteTwoTone twoToneColor={'#ff4d4f'} style={{ cursor: 'pointer' }} />
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
            <ProTable<IUser, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = '';
                    if (params) {
                        if (params.email) {
                            query += `&email_like=${params.email}`;
                        }
                        if (params.fullName) {
                            query += `&fullName_like=${params.fullName}`;
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
                    const allUser = await getUsersApi(query);

                    return {
                        data: allUser.data,
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
                headerTitle="Table user"
                toolBarRender={() => [
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
            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateUser openModalCreate={openModalCreate} setOpenModalCreate={setOpenModalCreate} refreshTable={refreshTable}/>
        </>
    );
};

export default TableUser;
