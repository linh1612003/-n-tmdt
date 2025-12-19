import React, { useState } from "react";
import "./style.css";
<<<<<<< HEAD
import { login, checkEmailAndSendOtp, verifyOtpAndRegister } from "../userSlice";
=======
import { login, register } from "../userSlice";
>>>>>>> origin/back-up
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema, registerSchema } from '../validationSchema'
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import * as Yup from "yup";

const otpSchema = Yup.object().shape({
    otp: Yup.string()
        .required("Required")
        .length(6, "OTP must be exactly 6 digits")
        .matches(/^\d+$/, "OTP must contain only numbers"),
});
=======
>>>>>>> origin/back-up

export const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [isSwitch, setIsSwitch] = useState(false);
    const [formData, setFormData] = useState({ username: '', displayName: '', password: '' });
<<<<<<< HEAD
    const [showOtpStep, setShowOtpStep] = useState(false);
    const [registerData, setRegisterData] = useState(null);
=======
>>>>>>> origin/back-up
    const isAdmin = localStorage.getItem('role') || ''

    const changeForm = (e) => {
        e.preventDefault();
        setIsSignUp(!isSignUp);
        setIsSwitch(!isSwitch);
    };

    const navigate = useNavigate();


    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
<<<<<<< HEAD

=======
      
>>>>>>> origin/back-up
    const handleLoginSubmit = async (values, { setSubmitting }) => {
        try {
            const action = login(values);
            const resultAction = await dispatch(action);
            const user = unwrapResult(resultAction);
<<<<<<< HEAD

            enqueueSnackbar('Login successfully !!!', { variant: 'success' });

=======
            
            enqueueSnackbar('Login successfully !!!', { variant: 'success' });
    
>>>>>>> origin/back-up
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/products');
            }
        } catch (error) {
<<<<<<< HEAD
            let errMessage = error.response?.data?.message || error.message || 'Login failed';

            // Kiểm tra nếu email chưa được đăng ký
            if (errMessage.includes('User name is not exist') || errMessage.includes('not exist')) {
                errMessage = 'Email này chưa được đăng ký. Vui lòng đăng ký tài khoản trước.';
            }
            // Kiểm tra nếu mật khẩu sai
            else if (errMessage.includes('Password is not correct') || errMessage.includes('not correct')) {
                errMessage = 'Mật khẩu không đúng. Vui lòng thử lại.';
            }

=======
            const errMessage = error.response?.data?.message || error.message || 'Login failed';
>>>>>>> origin/back-up
            console.log('Failed to login : ', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
            navigate('/login');
        } finally {
            setSubmitting(false);
        }
    };
<<<<<<< HEAD

    const handleRegisterSubmit = async (values, { setSubmitting }) => {
        try {
            // Kiểm tra email và gửi OTP
            const checkEmailAction = checkEmailAndSendOtp(values.username);
            const checkEmailResult = await dispatch(checkEmailAction);
            unwrapResult(checkEmailResult);

            // Lưu thông tin đăng ký để dùng ở bước OTP
            setRegisterData(values);
            setShowOtpStep(true);
            enqueueSnackbar('Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email.', { variant: 'success' });
        } catch (error) {
            let errMessage = error.response?.data?.message || error.message || 'Kiểm tra email thất bại';
            const status = error.response?.status;

            // Kiểm tra nếu email không tồn tại
            if (status === 404 || errMessage.includes('không tồn tại') || errMessage.includes('not found')) {
                errMessage = 'Email này không tồn tại. Vui lòng kiểm tra lại email.';
            }
            // Kiểm tra nếu email đã được đăng ký đầy đủ
            else if (status === 409 || errMessage.includes('đã được đăng ký') || errMessage.includes('already exists')) {
                errMessage = 'Email này đã được đăng ký. Vui lòng đăng nhập.';
            }

            console.log('Failed to check email : ', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleOtpSubmit = async (values, { setSubmitting }) => {
        try {
            // Verify OTP và đăng ký
            const verifyOtpAction = verifyOtpAndRegister({
                email: registerData.username,
                otp: values.otp,
                username: registerData.username,
                displayName: registerData.displayName,
                password: registerData.password,
            });
            const verifyOtpResult = await dispatch(verifyOtpAction);
            unwrapResult(verifyOtpResult);

            enqueueSnackbar('Đăng ký thành công !!!', { variant: 'success' });

            // Tự động đăng nhập sau khi đăng ký thành công
            const loginAction = login({
                username: registerData.username,
                password: registerData.password
            });
            const loginResult = await dispatch(loginAction);
            const user = unwrapResult(loginResult);

            enqueueSnackbar('Đăng nhập thành công !!!', { variant: 'success' });

            // Chuyển đến trang sản phẩm
            navigate('/products');
        } catch (error) {
            let errMessage = error.response?.data?.message || error.message || 'Xác thực OTP thất bại';

            // Kiểm tra nếu OTP không hợp lệ
            if (errMessage.includes('không hợp lệ') || errMessage.includes('hết hạn')) {
                errMessage = 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
            }

            console.log('Failed to verify OTP : ', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToRegister = () => {
        setShowOtpStep(false);
        setRegisterData(null);
=======
    
    const handleRegisterSubmit = async (values, { setSubmitting }) => {
        try {
            const action = register(values);
            const resultAction = await dispatch(action);
            unwrapResult(resultAction);
            enqueueSnackbar('Registration successfully !!!', { variant: 'success' });
        } catch (error) {
            const errMessage = error.response?.data?.message || error.message || 'Registration failed';
            console.log('Failed to register : ', errMessage);
            enqueueSnackbar(errMessage, { variant: 'error' });
        }
        setSubmitting(false);
>>>>>>> origin/back-up
    };

    const HandleLoginWithFacebook = () => {
        window.location.href = "http://localhost:5000/api/auth/facebook/login";
    };
    const HandleLoginWithGoogle = () => {
        window.location.href = "http://localhost:5000/api/auth/google/login";
    };

    return (
        <div className="login-page">
            <div className="main-login-page">
                <div className={`a-container ${isSwitch && "is-txl is-z200"}`}>
<<<<<<< HEAD
                    {!showOtpStep ? (
                        <Formik
                            initialValues={formData}
                            validationSchema={registerSchema}
                            onSubmit={handleRegisterSubmit}
                        >
                            {({ isSubmitting, handleChange, handleBlur }) => (
                                <Form className="form" id="a-form">
                                    <h2 className="form_title title">Create Account</h2>
                                    <span className="form__span">or use email for registration</span>
                                    <Field className="form__input" name="username" type="email" placeholder="Email" onChange={handleChange} onBlur={handleBlur} />
                                    <ErrorMessage name="username" component="div" className="text-danger" />
                                    <Field className="form__input displayName" name="displayName" type="text" placeholder="Name" onChange={handleChange} onBlur={handleBlur} />
                                    <ErrorMessage name="displayName" component="div" className="text-danger" />
                                    <Field className="form__input password" name="password" type="password" placeholder="Password" onChange={handleChange} onBlur={handleBlur} />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                    <button className="form__button button submit" type="submit" disabled={isSubmitting}>SIGN UP</button>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <Formik
                            initialValues={{ otp: '' }}
                            validationSchema={otpSchema}
                            onSubmit={handleOtpSubmit}
                        >
                            {({ isSubmitting, handleChange, handleBlur }) => (
                                <Form className="form" id="a-form">
                                    <h2 className="form_title title">Xác thực OTP</h2>
                                    <span className="form__span">Nhập mã OTP 6 chữ số đã được gửi đến email của bạn</span>
                                    <Field
                                        className="form__input"
                                        name="otp"
                                        type="text"
                                        placeholder="Nhập mã OTP"
                                        maxLength="6"
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            e.target.value = value;
                                            handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="otp" component="div" className="text-danger" />
                                    <button className="form__button button submit" type="submit" disabled={isSubmitting}>Xác thực</button>
                                    <button
                                        className="form__button button"
                                        type="button"
                                        onClick={handleBackToRegister}
                                        style={{ marginTop: '10px', background: '#6c757d' }}
                                    >
                                        Quay lại
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}
=======
                    <Formik
                        initialValues={formData}
                        validationSchema={registerSchema}
                        onSubmit={handleRegisterSubmit}
                    >
                        {({ isSubmitting, handleChange, handleBlur }) => (
                            <Form className="form" id="a-form">
                                <h2 className="form_title title">Create Account</h2>
                                <span className="form__span">or use displayName for registration</span>
                                <Field className="form__input" name="username" type="text" placeholder="Email" onChange={handleChange} onBlur={handleBlur} />
                                <ErrorMessage name="username" component="div" className="text-danger" />
                                <Field className="form__input displayName" name="displayName" type="text" placeholder="Name" onChange={handleChange} onBlur={handleBlur} />
                                <ErrorMessage name="displayName" component="div" className="text-danger" />
                                <Field className="form__input password" name="password" type="password" placeholder="Password" onChange={handleChange} onBlur={handleBlur} />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                                <button className="form__button button submit" type="submit" disabled={isSubmitting}>SIGN UP</button>
                            </Form>
                        )}
                    </Formik>
>>>>>>> origin/back-up
                </div>
                <div className={`b-container ${isSwitch && "is-txl"}`}>
                    <Formik
                        initialValues={formData}
                        validationSchema={loginSchema}
                        onSubmit={handleLoginSubmit}
                    >
                        {({ isSubmitting, handleChange, handleBlur }) => (
                            <Form className="form">
                                <h2 className="form_title title">Sign in to Website</h2>
                                <div className="form__icons">
                                    <div className="form__icon">
                                        <box-icon name='facebook-square' type='logo' onClick={HandleLoginWithFacebook} ></box-icon>
                                        <box-icon ></box-icon>
                                    </div>
                                    <div className="form__icon">
                                        <box-icon name='google' type='logo' onClick={HandleLoginWithGoogle}></box-icon>
                                    </div>
                                </div>
                                <span className="form__span">or use your displayName account</span>
                                <Field className="form__input" name="username" type="text" placeholder="Display Name" onChange={handleChange} onBlur={handleBlur} />
                                <ErrorMessage name="username" component="div" className="text-danger" />
                                <Field className="form__input" name="password" type="password" placeholder="Password" onChange={handleChange} onBlur={handleBlur} />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                                <a href="/forgotPassword" className="form__link">Forgot your password?</a>
                                <button className="form__button button submit" type="submit" disabled={isSubmitting}>SIGN IN</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className={isSwitch ? "switch is-gx is-txr" : "switch"} id="switch-cnt">
                    <div className={`switch__circle ${isSwitch && "is-txr"}`}></div>
                    <div className={`switch__circle switch__circle--t ${isSwitch && "is-txr"}`}></div>
                    <div className={`switch__container ${isSwitch && "is-hidden"}`} id="switch-c1">
                        <h2 className="switch__title title">Welcome Back !</h2>
                        <p className="switch__description description">To keep connected with us please login with your personal info</p>
                        <button onClick={changeForm} className="switch__button button switch-btn">SIGN UP</button>
                    </div>
                    <div className={`switch__container ${!isSwitch && "is-hidden"}`} id="switch-c2">
                        <h2 className="switch__title title">Hello Friend !</h2>
                        <p className="switch__description description">Enter your personal details and start journey with us</p>
                        <button onClick={changeForm} className="switch__button button switch-btn">SIGN IN</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
