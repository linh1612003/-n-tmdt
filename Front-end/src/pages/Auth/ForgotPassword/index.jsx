import React, { useState } from "react";
import "./style.css";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import userApi from "../../../api/userApi";

const emailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
});

const resetPasswordSchema = Yup.object().shape({
    otp: Yup.string()
        .required("Vui lòng nhập mã OTP")
        .length(6, "OTP phải có đúng 6 chữ số")
        .matches(/^\d+$/, "OTP chỉ chứa số"),
    newPassword: Yup.string()
        .required("Vui lòng nhập mật khẩu mới")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: Yup.string()
        .required("Vui lòng xác nhận mật khẩu")
        .oneOf([Yup.ref('newPassword')], "Mật khẩu xác nhận không khớp"),
});

export const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP và password mới
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleRequestReset = async (values, { setSubmitting }) => {
        try {
            const response = await userApi.forgotPassword(values.email);
            setEmail(values.email);
            setStep(2);
            enqueueSnackbar(response.message || 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email.', { variant: 'success' });
        } catch (error) {
            let errMessage = error.response?.data?.message || error.message || 'Gửi email thất bại';
            
            if (errMessage.includes('không tồn tại') || errMessage.includes('not exist')) {
                errMessage = 'Email này không tồn tại. Vui lòng kiểm tra lại email.';
            } else if (errMessage.includes('chưa được đăng ký')) {
                errMessage = 'Tài khoản này chưa được đăng ký đầy đủ. Vui lòng đăng ký tài khoản trước.';
            }

            console.log('Failed to request password reset:', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (values, { setSubmitting }) => {
        try {
            const response = await userApi.resetPassword({
                email: email,
                otp: values.otp,
                newPassword: values.newPassword,
            });
            
            enqueueSnackbar(response.message || 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.', { variant: 'success' });
            
            // Chuyển đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            let errMessage = error.response?.data?.message || error.message || 'Đặt lại mật khẩu thất bại';
            
            if (errMessage.includes('không hợp lệ') || errMessage.includes('hết hạn')) {
                errMessage = 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
            } else if (errMessage.includes('không tồn tại')) {
                errMessage = 'Email này không tồn tại. Vui lòng kiểm tra lại email.';
            }

            console.log('Failed to reset password:', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToEmail = () => {
        setStep(1);
        setEmail('');
    };

    return (
        <div className="login-page">
            <div className="main-login-page">
                <div className="forgot-password-container">
                    {step === 1 ? (
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={emailSchema}
                            onSubmit={handleRequestReset}
                        >
                            {({ isSubmitting, handleChange, handleBlur }) => (
                                <Form className="form" id="forgot-password-form">
                                    <h2 className="form_title title">Quên mật khẩu</h2>
                                    <span className="form__span">Nhập email của bạn để nhận mã OTP đặt lại mật khẩu</span>
                                    <Field 
                                        className="form__input" 
                                        name="email" 
                                        type="email" 
                                        placeholder="Email" 
                                        onChange={handleChange} 
                                        onBlur={handleBlur} 
                                    />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                    <button className="form__button button submit" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi mã OTP'}
                                    </button>
                                    <a href="/login" className="form__link" style={{ marginTop: '15px', display: 'block', textAlign: 'center' }}>
                                        Quay lại đăng nhập
                                    </a>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <Formik
                            initialValues={{ otp: '', newPassword: '', confirmPassword: '' }}
                            validationSchema={resetPasswordSchema}
                            onSubmit={handleResetPassword}
                        >
                            {({ isSubmitting, handleChange, handleBlur }) => (
                                <Form className="form" id="reset-password-form">
                                    <h2 className="form_title title">Đặt lại mật khẩu</h2>
                                    <span className="form__span">Nhập mã OTP và mật khẩu mới</span>
                                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                                        Email: <strong>{email}</strong>
                                    </p>
                                    <Field
                                        className="form__input"
                                        name="otp"
                                        type="text"
                                        placeholder="Nhập mã OTP (6 chữ số)"
                                        maxLength="6"
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            e.target.value = value;
                                            handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="otp" component="div" className="text-danger" />
                                    <Field 
                                        className="form__input" 
                                        name="newPassword" 
                                        type="password" 
                                        placeholder="Mật khẩu mới" 
                                        onChange={handleChange} 
                                        onBlur={handleBlur} 
                                    />
                                    <ErrorMessage name="newPassword" component="div" className="text-danger" />
                                    <Field 
                                        className="form__input" 
                                        name="confirmPassword" 
                                        type="password" 
                                        placeholder="Xác nhận mật khẩu mới" 
                                        onChange={handleChange} 
                                        onBlur={handleBlur} 
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                    <button className="form__button button submit" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                    </button>
                                    <button
                                        className="form__button button"
                                        type="button"
                                        onClick={handleBackToEmail}
                                        style={{ marginTop: '10px', background: '#6c757d' }}
                                    >
                                        Quay lại
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </div>
    );
};

