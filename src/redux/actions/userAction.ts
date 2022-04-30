import { Dispatch } from "redux";
import { IAuth, IAuthType, AUTH } from "../types/authType";
import { IAlertType, ALERT } from "../types/alertType";

import { checkImage, imageUpload } from "../../utils/ImageUpload";
import { getAPI, patchAPI, postAPI } from "../../utils/FetchData";
import { checkPassword } from "../../utils/Valid";
import { GET_OTHER_INFO, IGetOtherInfoType } from "../types/profileType";
import { checkTokenExp } from "../../utils/checkTokenExp";

export const updateUser =
  (avatar: File, name: string, auth: IAuth) =>
  async (dispatch: Dispatch<IAlertType | IAuthType>) => {
    if (!auth.access_token || !auth.user) return;
    const result = await checkTokenExp(auth.access_token, dispatch);
    const access_token = result ? result : auth.access_token;

    let url = "";
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      if (avatar) {
        const check = checkImage(avatar);
        if (check) return dispatch({ type: ALERT, payload: { errors: check } });

        // upload img lên cloudinary
        const photo = await imageUpload(avatar);
        url = photo.url;
      }
      // Lưu giá trị lên store
      dispatch({
        type: AUTH,
        payload: {
          access_token: auth.access_token,
          user: {
            ...auth.user,
            avatar: url ? url : auth.user.avatar,
            name: name ? name : auth.user.name,
          },
        },
      });

      const res = await patchAPI(
        "user",
        {
          avatar: url ? url : auth.user.avatar,
          name: name ? name : auth.user.name,
        },
        access_token
      );

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const resetPassword =
  (password: string, cf_password: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | IAuthType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    // Kiểm tra password và cf_password
    const msg = checkPassword(password, cf_password);
    if (msg) return dispatch({ type: ALERT, payload: { errors: msg } });

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // const res = await patchAPI("reset_password", { password }, token);
      const res = await patchAPI("reset_password", { password }, access_token);
      console.log("Res: ", res);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getOtherInfo =
  (id: string) =>
  async (dispatch: Dispatch<IGetOtherInfoType | IAlertType>) => {
    console.log("ID: ", id);
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`user/${id}`);
      dispatch({ type: GET_OTHER_INFO, payload: { ...res.data, id } });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };
