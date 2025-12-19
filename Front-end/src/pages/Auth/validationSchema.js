import * as Yup from "yup";

export const passwordSchema = Yup.string()
    .required("Required")
    .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,14}$/,
        "Password must be 6 - 14 characters and has numeric characters"
    );

<<<<<<< HEAD
// Schema cho đăng nhập - username có thể là email hoặc displayName
=======
>>>>>>> origin/back-up
export const usernameSchema = Yup.string()
    .required("Required")
    .min(4, "Must be 4 characters or more");

<<<<<<< HEAD
// Schema cho đăng ký - username phải là email
export const emailSchema = Yup.string()
    .required("Required")
    .email("Must be a valid email")
    .min(4, "Must be 4 characters or more");

=======
>>>>>>> origin/back-up
export const notJustNumber = Yup.string()
    .required("Required")
    .matches(/^(?![0-9]+$).*/, "Title should not be just numbers");

export const loginSchema = Yup.object().shape({
    username: usernameSchema,
    password: passwordSchema,
});

export const registerSchema = Yup.object().shape({
<<<<<<< HEAD
    username: emailSchema,
=======
    username: usernameSchema,
>>>>>>> origin/back-up
    displayName: notJustNumber,
    password: passwordSchema,
});
