import { Dispatch } from "redux";
import { IAuthType } from "../types/authType";
import { IAlertType, ALERT } from "../types/alertType";

import { IBlog } from "../../utils/TypeScript";
import { imageUpload } from "../../utils/ImageUpload";
import { deleteAPI, getAPI, postAPI, putAPI } from "../../utils/FetchData";
import {
  CREATE_BLOGS_USER_ID,
  DELETE_BLOGS_USER_ID,
  GET_BLOGS_CATEGORY_ID,
  GET_BLOGS_USER_ID,
  GET_HOME_BLOGS,
  IBlogUserType,
  IDeleteBlogsUserType,
  IGetBlogsCategoryType,
  IGetBlogsUserType,
  IGetHomeBlogsType,
} from "../types/blogType";
import { checkTokenExp } from "../../utils/checkTokenExp";

export const createBlog =
  (blog: IBlog, token: string) =>
  async (dispatch: Dispatch<IAlertType | IBlogUserType>) => {
    let url;
    // console.log({ blog, token });
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (typeof blog.thumbnail !== "string") {
        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;
      } else {
        url = blog.thumbnail;
      }

      const newBlog = { ...blog, thumbnail: url };
      // console.log("New Blog: ", newBlog);
      // const res = await postAPI("blog", newBlog, token);
      const res = await postAPI("blog", newBlog, access_token);
      dispatch({
        type: CREATE_BLOGS_USER_ID,
        payload: res.data,
      });
      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getHomeBlogs =
  () => async (dispatch: Dispatch<IAlertType | IGetHomeBlogsType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI("home/blogs");
      // console.log(res);
      dispatch({ type: GET_HOME_BLOGS, payload: res.data });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getBlogsByCategoryId =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | IGetBlogsCategoryType>) => {
    // console.log({ search });
    try {
      let limit = 4;
      let value = search ? search : `?page=${1}`;
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`blogs/category/${id}${value}&limit=${limit}`);
      // console.log("RES: ", res);
      dispatch({
        type: GET_BLOGS_CATEGORY_ID,
        payload: { ...res.data, id, search },
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getBlogsByUserId =
  (id: string, search = `?page=${1}`) =>
  async (dispatch: Dispatch<IAlertType | IGetBlogsUserType>) => {
    try {
      let limit = 4;
      let value = search ? search : `?page=${1}`;
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`blogs/user/${id}${value}&limit=${limit}`);
      // console.log("RES: ", res);
      dispatch({
        type: GET_BLOGS_USER_ID,
        payload: { ...res.data, id, search },
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const updateBlog =
  (blog: IBlog, token: string) =>
  async (dispatch: Dispatch<IAlertType | IAuthType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      let url;
      if (typeof blog.thumbnail !== "string") {
        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;
      } else {
        url = blog.thumbnail;
      }

      const newBlog = { ...blog, thumbnail: url };
      // const res = await putAPI(`blog/${newBlog._id}`, newBlog, token);
      const res = await putAPI(`blog/${newBlog._id}`, newBlog, access_token);
      console.log("RES: ", res);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const deleteBlog =
  (blog: IBlog, token: string) =>
  async (dispatch: Dispatch<IAlertType | IDeleteBlogsUserType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      dispatch({ type: DELETE_BLOGS_USER_ID, payload: blog });
      // const res = await deleteAPI(`blog/${blog._id}`, token);
      const res = await deleteAPI(`blog/${blog._id}`, access_token);
      // console.log("RES: ", res);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
