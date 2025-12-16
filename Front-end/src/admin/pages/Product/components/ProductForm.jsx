import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select } from 'antd';
import axios from 'axios';
import UploadImage from './UploadImage';

const { Option } = Select;

const ProductForm = ({ product, onClose, accessToken }) => {
  const [form] = Form.useForm();
  const [imageLinks, setImageLinks] = React.useState([]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product]);

  const handleUploadSuccess = (links) => {
    setImageLinks(links);
  };

  const onFinish = async (values) => {
    // Lọc bỏ các phần tử rỗng trong mảng images
    const filteredImages = imageLinks.filter(link => link && link.trim() !== "");
    try {
      const productData = {
        ...values,
        images: filteredImages, // Gửi mảng đã lọc
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
      <Form.Item name='typeId' label='Loại sản phẩm' rules={[{ required: true }]}>
        <Select>
          <Option value='ring'>Nhẫn</Option>
          <Option value='necklace'>Dây chuyền</Option>
          <Option value='bracelet'>Vòng tay</Option>
          <Option value='earring'>Bông tai</Option>
          <Option value='anklet'>Lắc chân</Option>
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
