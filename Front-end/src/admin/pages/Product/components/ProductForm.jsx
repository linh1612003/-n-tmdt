<<<<<<< HEAD
import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select } from 'antd';
import axios from 'axios';
import UploadImage from './UploadImage';
=======
import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, message } from 'antd';
import axios from 'axios';
import UploadImage from './UploadImage';
import categoryApi from '../../../../api/categoryApi';
>>>>>>> origin/back-up

const { Option } = Select;

const ProductForm = ({ product, onClose, accessToken }) => {
  const [form] = Form.useForm();
  const [imageLinks, setImageLinks] = React.useState([]);
<<<<<<< HEAD
=======
  const [categories, setCategories] = useState([]);
>>>>>>> origin/back-up

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
<<<<<<< HEAD
    } else {
      form.resetFields();
    }
  }, [product]);

=======
      // Nếu có product, set images hiện tại
      if (product.images && product.images.length > 0) {
        setImageLinks(product.images);
      }
    } else {
      form.resetFields();
      setImageLinks([]);
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

>>>>>>> origin/back-up
  const handleUploadSuccess = (links) => {
    setImageLinks(links);
  };

  const onFinish = async (values) => {
    // Lọc bỏ các phần tử rỗng trong mảng images
    const filteredImages = imageLinks.filter(link => link && link.trim() !== "");
    try {
      const productData = {
        ...values,
<<<<<<< HEAD
        images: filteredImages, // Gửi mảng đã lọc
=======
        // Nếu có images mới, dùng images mới, nếu không và đang edit, giữ nguyên images cũ
        images: filteredImages.length > 0 ? filteredImages : (product?.images || []),
>>>>>>> origin/back-up
      };
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      let savedProduct;
      if (product) {
        const response = await axios.put(`http://localhost:5000/api/products/${product._id}`, productData, config);
        savedProduct = response.data;
<<<<<<< HEAD
      } else {
        const response = await axios.post('http://localhost:5000/api/products', productData, config);
        savedProduct = response.data;
      }
      onClose();
    } catch (error) {
      if (error.response) {
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
=======
        message.success('Cập nhật sản phẩm thành công');
      } else {
        const response = await axios.post('http://localhost:5000/api/products', productData, config);
        savedProduct = response.data;
        message.success('Thêm sản phẩm thành công');
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        // Hiển thị lỗi validation chi tiết
        if (error.response.data?.message) {
          const errorMsg = Array.isArray(error.response.data.message) 
            ? error.response.data.message.join(', ')
            : error.response.data.message;
          message.error('Lỗi: ' + errorMsg);
        } else {
          message.error('Lỗi khi lưu sản phẩm. Vui lòng kiểm tra console để biết chi tiết.');
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        message.error('Không thể kết nối đến server. Vui lòng thử lại.');
      } else {
        console.error('Error message:', error.message);
        message.error('Lỗi: ' + error.message);
>>>>>>> origin/back-up
      }
    }
  };

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Form.Item name='images' label='Ảnh sản phẩm'>
        <UploadImage onUploadSuccess={handleUploadSuccess} product={product} accessToken={accessToken} />
      </Form.Item>
      <Form.Item name='name' label='Tên sản phẩm' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='description' label='Mô tả ngắn' rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name='descriptionFull' label='Mô tả chi tiết' rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name='originalPrice' label='Giá gốc' rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name='salePrice' label='Giá bán' rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
<<<<<<< HEAD
=======
      <Form.Item 
        name='quantity' 
        label='Số lượng nhập vào'
        rules={[
          { 
            validator: (_, value) => {
              if (value === undefined || value === null || value === '') {
                return Promise.resolve();
              }
              if (typeof value !== 'number') {
                return Promise.reject(new Error('Số lượng nhập vào phải là số'));
              }
              if (!Number.isInteger(value)) {
                return Promise.reject(new Error('Số lượng nhập vào phải là số nguyên'));
              }
              if (value <= 0) {
                return Promise.reject(new Error('Số lượng nhập vào phải lớn hơn 0'));
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <InputNumber 
          style={{ width: '100%' }}
          precision={0}
          step={1}
          parser={(value) => value ? Math.floor(parseFloat(value)) : ''}
        />
      </Form.Item>
      <Form.Item name='importPrice' label='Giá nhập'>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
>>>>>>> origin/back-up
      <Form.Item name='material' label='Chất liệu' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name='weight' label='Trọng lượng (gram)'>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name='size' label='Kích cỡ'>
        <Input />
      </Form.Item>
      <Form.Item name='gender' label='Giới tính'>
        <Select allowClear>
          <Option value='Nam'>Nam</Option>
          <Option value='Nữ'>Nữ</Option>
          <Option value='Unisex'>Unisex</Option>
        </Select>
      </Form.Item>
      <Form.Item name='style' label='Phong cách'>
        <Input />
      </Form.Item>
      <Form.Item name='brand' label='Thương hiệu'>
        <Input />
      </Form.Item>
      <Form.Item name='origin' label='Xuất xứ'>
        <Input />
      </Form.Item>
      <Form.Item name='warranty' label='Bảo hành'>
        <Input />
      </Form.Item>
<<<<<<< HEAD
      <Form.Item name='typeId' label='Loại sản phẩm' rules={[{ required: true }]}>
        <Select>
          <Option value='ring'>Nhẫn</Option>
          <Option value='necklace'>Dây chuyền</Option>
          <Option value='bracelet'>Vòng tay</Option>
          <Option value='earring'>Bông tai</Option>
          <Option value='anklet'>Lắc chân</Option>
=======
      <Form.Item name='categoryId' label='Danh mục (Loại sản phẩm)' rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
        <Select placeholder="Chọn danh mục">
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
>>>>>>> origin/back-up
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
