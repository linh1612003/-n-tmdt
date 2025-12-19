import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import { Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import orderApi from '../../../api/ordersApi';
import userApi from '../../../api/userApi';

const validationSchema = Yup.object().shape({
    receiver: Yup.string().required('Vui lòng nhập tên người nhận'),
    phone: Yup.string().required('Vui lòng nhập số điện thoại'),
    address: Yup.string().required('Vui lòng nhập địa chỉ'),
    addressDetail: Yup.string().required('Vui lòng nhập chi tiết địa chỉ'),
});

function UpdateShippingInfo({ shippingInfo, setShippingInfo, onClose }) {
    const handleUpdate = async (values) => {
        try {
            const userId = localStorage.getItem('userId');
            // Map phone thành contactPhone cho backend
            const payload = {
                contactPhone: values.phone,
                address: values.address,
                addressDetail: values.addressDetail,
            };
            await orderApi.updateShippingInfo(userId, payload);

            // Cập nhật displayName nếu có thay đổi (cần lấy userInfo hiện tại để so sánh)
            // Note: Có thể cần thêm logic để cập nhật displayName nếu cần

            setShippingInfo(values);
            onClose();
        } catch (error) {
            console.error('Error updating shipping info:', error);
        }
    };

    return (
        <Formik
            initialValues={shippingInfo}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
        >
            {({ values, handleChange, handleBlur, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Tên người nhận"
                            name="receiver"
                            value={values.receiver}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                        <TextField
                            label="Số điện thoại"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                        <TextField
                            label="Địa chỉ"
                            name="address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                        <TextField
                            label="Chi tiết địa chỉ"
                            name="addressDetail"
                            value={values.addressDetail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" color="black" style={{ borderRadius: '0px' }}>
                            Cập nhật
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}

UpdateShippingInfo.propTypes = {
    shippingInfo: PropTypes.object.isRequired,
    setShippingInfo: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default UpdateShippingInfo;
