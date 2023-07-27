/*
 *
 * RETURN actions
 *
 */

import { success } from 'react-notification-system-redux';
import axios from 'axios';
import DOMPurify from 'dompurify';

import {
  FETCH_ORDER_RETURN,
  ADD_ORDER_RETURN,
  REMOVE_ORDER_RETURN,
  FETCH_PRODUCT_ORDER_RETURN,
  ORDER_RETURN_CHANGE,
  SET_RETURN_LOADING,
  RESET_ORDER_RETURN,
  SET_ORDER_RETURN_FORM_ERRORS,
  SET_ADVANCED_FILTERS
} from './constants';
import handleError from '../../utils/error';
import { allFieldsValidation, santizeFields } from '../../utils/validation';



export const returnOrderChange = (name, value) => {
  let formData = {};
  formData[name] = value;
 
  return {
    type: ORDER_RETURN_CHANGE,
    payload: formData
  };
};

// fetch reviews api
export const fetchReturnOrder = (n, v) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SET_RETURN_LOADING, payload: true });

      const response = await axios.get(`/api/returnorder`);

     
      const { returnOrder} = response.data;

      console.log(returnOrder,"sdkfjlsdjfsldjf");

      dispatch({ type: FETCH_ORDER_RETURN, payload: returnOrder });
      
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch({ type: SET_RETURN_LOADING, payload: false });
    }
  };
};

export const approveReturnOrder = returnorder => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`/api/returnorder/approve/${returnorder._id}`);

      dispatch(fetchReturnOrder());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const rejectReturnOrder = returnorder => {
  return async (dispatch, getState) => {
    try {
      await axios.put(`/api/returnorder/reject/${returnorder._id}`);

      dispatch(fetchReturnOrder());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// delete review api
export const deleteReturnOrder = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(`/api/returnorder/delete/${id}`);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success == true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: REMOVE_ORDER_RETURN,
          payload: id
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetch product reviews api
// export const fetchProductReviews = slug => {
//   return async (dispatch, getState) => {
//     try {
//       const response = await axios.get(`/api/review/${slug}`);

//       const { ratingSummary, totalRatings, totalReviews, totalSummary } =
//         getProductReviewsSummary(response.data.reviews);

//       dispatch({
//         type: FETCH_PRODUCT_REVIEWS,
//         payload: {
//           reviews: response.data.reviews,
//           reviewsSummary: {
//             ratingSummary,
//             totalRatings,
//             totalReviews,
//             totalSummary
//           }
//         }
//       });
//     } catch (error) {
//       handleError(error, dispatch);
//     }
//   };
// };

export const addReturnOrder = () => {
  return async (dispatch, getState) => {
    
    try {
      const rules = {
        
        upinumber: 'required',
        reason: 'required',
      };

      const returnOrder = getState().returnOrder.returnOrderFormData;
      const orderdata = getState().order.order;

      
      const newReturnOrder = {
        ...returnOrder,
        order:orderdata._id
      };
      


      const { isValid, errors } = allFieldsValidation(newReturnOrder, rules, {
       
        'required.upinumber': 'UPI Number is required.',
        'required.reason': 'Reason is required.',
      });

      if (!isValid) {
        return dispatch({ type: SET_ORDER_RETURN_FORM_ERRORS, payload: errors });
      }

      const santizedReturnOrder = santizeFields(newReturnOrder);
      const response = await axios.post(`/api/returnorder/add`, santizedReturnOrder);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1,
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        // Assuming fetchProductReviews and other dispatched actions are defined and imported correctly
        dispatch(fetchProductReviews(product.slug));
        dispatch({ type: RESET_ORDER_RETURN });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

