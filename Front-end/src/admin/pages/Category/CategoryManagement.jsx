import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import categoryApi from '../../../api/categoryApi';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [form] = Form.useForm();
    const accessToken = localStorage.getItem('access_token');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách danh mục');
        }
    };

    const handleAdd = () => {
        setSelectedCategory(null);
        form.resetFields();
        setVisible(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        form.setFieldsValue({
            name: category.name,
        });
        setVisible(true);
    };

    const handleDelete = async (categoryId) => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            message.success('Xóa danh mục thành công');
            fetchCategories();
        } catch (error) {
            message.error('Lỗi khi xóa danh mục');
        }
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
            };
            if (selectedCategory) {
                await axios.put(
                    `http://localhost:5000/api/categories/${selectedCategory._id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                message.success('Cập nhật danh mục thành công');
            } else {
                await axios.post('http://localhost:5000/api/categories', payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                message.success('Thêm danh mục thành công');
            }
            setVisible(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            console.error('Error response:', error.response?.data);
            
            // Hiển thị lỗi validation chi tiết
            if (error.response?.data?.message) {
                const errorMsg = Array.isArray(error.response.data.message) 
                    ? error.response.data.message.join(', ')
                    : error.response.data.message;
                message.error(errorMsg);
            } else if (error.response?.data?.error) {
                message.error(error.response.data.error);
            } else if (error.message) {
                message.error(error.message);
            } else {
                message.error('Lỗi khi lưu danh mục. Vui lòng kiểm tra console để biết chi tiết.');
            }
        }
    };

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        style={{ color: 'white', background: 'black', borderRadius: '0px', marginRight: '10px' }}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        style={{ color: 'black', background: 'white', borderRadius: '0px', border: '1px solid black' }}
                        danger
                        onClick={() => handleDelete(record._id)}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <Button
                    onClick={handleAdd}
                    style={{ color: 'white', background: 'black', borderRadius: '0px', marginBottom: '10px' }}
                >
                    Thêm danh mục mới
                </Button>
            </div>
            <Table columns={columns} dataSource={categories} rowKey="_id" />
            <Modal
                title={selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;

