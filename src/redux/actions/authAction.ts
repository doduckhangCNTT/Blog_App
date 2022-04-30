import { Dispatch } from "redux";
import { checkTokenExp } from "../../utils/checkTokenExp";
import { getAPI, postAPI } from "../../utils/FetchData";
import { IUserLogin, IUserRegister } from "../../utils/TypeScript";
import { validPhone, validRegister } from "../../utils/Valid";
import { ALERT, IAlertType } from "../types/alertType";
import { AUTH, IAuthType } from "../types/authType";

export const login =
  (userLogin: IUserLogin) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // Kiểm tra thông tin của user vừa login có đúng hay ko
      const res = await postAPI("login", userLogin);
      // console.log(res);
      // Đẩy thông tin len reducer
      dispatch({
        type: AUTH,
        payload: res.data,
      });

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
      localStorage.setItem("logged", "true");
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const register =
  (userRegister: IUserRegister) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    // Kiểm tra giá trị truyền vào có đúng như yêu cầu ko
    const check = validRegister(userRegister);

    if (check.errLength > 0) {
      return dispatch({
        type: ALERT,
        payload: { errors: check.errMsg },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // Kiểm tra thông tin của user vừa login có đúng hay ko
      const res = await postAPI("register", userRegister);
      console.log(res);
      // Đẩy thông tin len reducer
      // dispatch({
      //   type: AUTH,
      //   payload: {
      //     token: res.data.access_token,
      //     user: res.data.user,
      //   },
      // });

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const refreshToken =
  () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    // Luu lai lich su dang nhap
    const logged = localStorage.getItem("logged");
    // console.log("Logged: ", logged);
    if (logged !== "true") {
      return;
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // Lay thong tin user
      const res = await getAPI("refresh_token");
      // console.log(res);
      dispatch({ type: AUTH, payload: res.data });

      dispatch({ type: ALERT, payload: {} });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
      localStorage.removeItem("logged");
    }
  };

export const logout =
  (token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      localStorage.removeItem("logged");
      dispatch({ type: AUTH, payload: {} });
      await getAPI("logout", access_token);
      window.location.href = "/";
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const googleLogin =
  (id_token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // Kiểm tra thông tin của user vừa login có đúng hay ko
      const res = await postAPI("google_login", { id_token });
      console.log(res);
      // Đẩy thông tin len reducer
      dispatch({
        type: AUTH,
        payload: res.data,
      });

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
      localStorage.setItem("logged", "true");
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const facebookLogin =
  (accessToken: string, userID: string) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // Kiểm tra thông tin của user vừa login có đúng hay ko
      const res = await postAPI("facebook_login", { accessToken, userID });
      console.log(res);
      // Đẩy thông tin len reducer
      dispatch({
        type: AUTH,
        payload: res.data,
      });

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
      localStorage.setItem("logged", "true");
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const loginSMS =
  (phone: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    // Kiểm tra phone có đúng định dạng như yêu cầu +84.....
    const check = validPhone(phone);

    if (!check) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Phone is not valid" },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // Kiểm tra thông tin của user vừa login có đúng hay ko
      const res = await postAPI("login_sms", { phone });

      if (!res.data.valid) {
        // Xác thực sms
        verifySMS(phone, dispatch);
      }
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const verifySMS = async (
  phone: string,
  dispatch: Dispatch<IAuthType | IAlertType>
) => {
  // Hien thi frame điền mã code
  const code = prompt("Enter your code");

  if (!code) {
    return;
  }

  try {
    dispatch({ type: ALERT, payload: { loading: true } });

    // Xác thực code gửi về điện thoại
    const res = await postAPI("sms_verify", { phone, code });
    console.log("SMS verify: ", res);

    dispatch({
      type: AUTH,
      payload: res.data,
    });

    dispatch({ type: ALERT, payload: { success: res.data.msg } });
    localStorage.setItem("logged", "true");
  } catch (error: any) {
    dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    setTimeout(() => {
      verifySMS(phone, dispatch);
    }, 100);
  }
};

export const forgotPassword =
  (account: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postAPI("forgot_password", { account });
      // console.log("RES: ", res);
      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };
