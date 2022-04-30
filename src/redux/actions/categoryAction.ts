import { Dispatch } from "redux";
import { checkTokenExp } from "../../utils/checkTokenExp";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../utils/FetchData";
import { ICategory } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  ICategoryType,
  UPDATE_CATEGORY,
} from "../types/categoryType";

export const createCategory =
  (name: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      // const res = await postAPI("category", { name }, token);
      const res = await postAPI("category", { name }, access_token);

      dispatch({
        type: CREATE_CATEGORY,
        payload: res.data.newCategory,
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getCategories =
  () => async (dispatch: Dispatch<ICategoryType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI("category");
      console.log("Get category: ", res);
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data.categories,
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const updateCategory =
  (data: ICategory, token: string) =>
  async (dispatch: Dispatch<ICategoryType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      dispatch({
        type: UPDATE_CATEGORY,
        payload: data,
      });
      // await patchAPI(`category/${data._id}`, { name: data.name }, token);
      await patchAPI(`category/${data._id}`, { name: data.name }, access_token);

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };

export const deleteCategory =
  (id: string, token: string) =>
  async (dispatch: Dispatch<ICategoryType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;

    console.log({ result });

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      dispatch({
        type: DELETE_CATEGORY,
        payload: id,
      });
      await deleteAPI(`category/${id}`, access_token);

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } });
    }
  };
