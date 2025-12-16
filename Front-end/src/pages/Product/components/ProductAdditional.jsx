import React, { useEffect, useState } from 'react';
import { Paper } from '@material-ui/core';
import { Table } from 'antd';
import { useParams } from 'react-router-dom';
import productsApi from '../../../api/productApi';

function ProductAdditional(props) {
  const [data, setData] = useState({});
  const params = useParams();
  const id = params.productId;

  useEffect(() => {
    (async () => {
      try {
        const response = await productsApi.get(id);
        setData(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [id]);

  const columns = [
    { title: 'Thông số', dataIndex: 'key', key: 'key' },
    { title: 'Giá trị', dataIndex: 'value', key: 'value' },
  ];

  const dataSource = [
    { key: 'Chất liệu', value: data.material },
    { key: 'Trọng lượng (gram)', value: data.weight },
    { key: 'Kích cỡ', value: data.size },
    { key: 'Giới tính', value: data.gender },
    { key: 'Phong cách', value: data.style },
    { key: 'Thương hiệu', value: data.brand },
    { key: 'Xuất xứ', value: data.origin },
    { key: 'Bảo hành', value: data.warranty },
  ];

  return (
    <Paper elevation={0} style={{ padding: '15px' }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        showHeader={true}
        bordered
      />
    </Paper>
  );
}

ProductAdditional.propTypes = {};

export default ProductAdditional;
