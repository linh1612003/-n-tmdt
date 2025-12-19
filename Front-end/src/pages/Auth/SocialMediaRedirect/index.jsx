import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";

export const SocialRedirect = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");
<<<<<<< HEAD
    const userId = searchParams.get("userId");
=======
    const userId =searchParams.get("userId");
>>>>>>> origin/back-up
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const token = {
            access_token: access_token || "",
            refresh_token: refresh_token || "",
<<<<<<< HEAD
            userId: userId || ""
        };
        localStorage.setItem("access_token", token.access_token);
        localStorage.setItem("userId", token.userId);
        // Lưu thời gian đăng nhập để ChatWidget có thể kiểm tra
        localStorage.setItem("login_time", Date.now().toString());
=======
            userId : userId || ""
        };
        localStorage.setItem("access_token", token.access_token);
        localStorage.setItem("userId", token.userId);
>>>>>>> origin/back-up
        enqueueSnackbar("Chào mừng trở lại ", { variant: '' });
        navigate("/")
    }, []);
    return <div>Hello window!</div>;
};