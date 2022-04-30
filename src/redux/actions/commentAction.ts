import { Dispatch } from "redux";
import { checkTokenExp } from "../../utils/checkTokenExp";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../utils/FetchData";
import { IComment } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import {
  DELETE_COMMENT,
  DELETE_REPLY,
  GET_COMMENTS,
  ICommentType,
  ICreateCommentType,
  IDeleteCommentType,
  IReplyCommentType,
  IUpdateCommentType,
} from "../types/commentType";

export const createComment =
  (data: IComment, token: string) =>
  async (dispatch: Dispatch<ICreateCommentType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // const res = await postAPI("comment", data, token);
      const res = await postAPI("comment", data, access_token);
      console.log({ res, dataUser: data.user });

      // dispatch({
      //   type: CREATE_COMMENT,
      //   payload: {
      //     ...res.data,
      //     user: data.user,
      //   },
      // });
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({
        type: ALERT,
        payload: { errors: error.response.data.msg },
      });
    }
  };

export const getComments =
  (id: string, num: number) =>
  async (dispatch: Dispatch<ICommentType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      let limit = 4;
      const res = await getAPI(`comment/blog/${id}?page=${num}&limit=${limit}`);
      // console.log("RES: ", res);
      dispatch({
        type: GET_COMMENTS,
        payload: {
          data: res.data.comments,
          total: res.data.total,
        },
      });
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({
        type: ALERT,
        payload: { errors: error.response.data.msg },
      });
    }
  };

export const replyComment =
  (data: IComment, token: string) =>
  async (dispatch: Dispatch<IReplyCommentType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // const res = await postAPI("reply_comment", data, token);
      const res = await postAPI("reply_comment", data, access_token);
      // console.log("RES: ", res);

      // dispatch({
      //   type: REPLY_COMMENT,
      //   payload: {
      //     ...res.data,
      //     user: data.user,
      //     reply_user: data.reply_user,
      //   },
      // });
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({
        type: ALERT,
        payload: { errors: error.response.data.msg },
      });
    }
  };

export const updateComment =
  (data: IComment, token: string) =>
  async (dispatch: Dispatch<IUpdateCommentType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      console.log({ data, token });
      // const res = await postAPI("comment", data, token);
      // console.log({ res, dataUser: data.user });

      // dispatch({
      //   type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENT,
      //   payload: data,
      // });

      // await patchAPI(`comment/${data._id}`, { content: data.content }, token);

      // await patchAPI(`comment/${data._id}`, { data }, token);
      await patchAPI(`comment/${data._id}`, { data }, access_token);
      // console.log("Res: ", res);
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({
        type: ALERT,
        payload: { errors: error.response.data.msg },
      });
    }
  };

export const deleteComment =
  (data: IComment, token: string) =>
  async (dispatch: Dispatch<IDeleteCommentType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      dispatch({
        type: data.comment_root ? DELETE_REPLY : DELETE_COMMENT,
        payload: data,
      });

      // await deleteAPI(`comment/${data._id}`, token);
      await deleteAPI(`comment/${data._id}`, access_token);
      // console.log("Res: ", res);
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({
        type: ALERT,
        payload: { errors: error.response.data.msg },
      });
    }
  };
