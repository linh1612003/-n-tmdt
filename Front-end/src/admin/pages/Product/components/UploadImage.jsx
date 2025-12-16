import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import axios from 'axios';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadImage = ({ onUploadSuccess, product, accessToken }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);

  useEffect(() => {
    if (product && product.images) {
      const formattedFileList = product.images.map((url) => ({
        uid: url,
        name: url,
        status: 'done',
        url: url,
      }));
      setFileList(formattedFileList);
      setImageLinks(product.images);
      onUploadSuccess(product.images);
    }
  }, [product]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ file, fileList: newFileList }) => {
    if (file.status === 'uploading') {
      setFileList(newFileList);
      return;
    }
    if (file.status === 'done' && file.originFileObj && !file.url) {
      try {
        const formData = new FormData();
        formData.append('files', file.originFileObj);
        const res = await axios.post('http://localhost:5000/api/uploads/product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const newLinks = res.data?.images || [];
        const updatedLinks = [...imageLinks, ...newLinks];
        setImageLinks(updatedLinks);
        const updatedFileList = newFileList.map(f => {
          if (f.uid === file.uid) {
            return { ...f, url: newLinks[0], status: 'done' };
          }
          return f;
        });
        setFileList(updatedFileList);
        onUploadSuccess(updatedLinks);
      } catch (err) {
      message.error('Upload failed.');
    }
    } else if (file.status === 'removed') {
      const removedIndex = fileList.findIndex(f => f.uid === file.uid);
      const updatedLinks = imageLinks.filter((_, idx) => idx !== removedIndex);
      setImageLinks(updatedLinks);
      onUploadSuccess(updatedLinks);
      setFileList(newFileList);
    } else {
    setFileList(newFileList);
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
      onSuccess({ status: 'done' });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        customRequest={customRequest}
        listType='picture-card'
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
        src={previewImage}
      />
    </>
  );
};

export default UploadImage;
