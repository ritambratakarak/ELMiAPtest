import { VIDEO } from '../type';

export const videosaction = (data) => {
  return async (dispatch) => {
    dispatch({
      type: VIDEO,
      payload: data,
    });
  };
};