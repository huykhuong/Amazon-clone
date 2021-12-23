import { basketActions } from "./basketSlice";
import db from "../../firebase";

export const sendCartData = (cart, SID) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      if (cart.length === 0) {
        db.collection("user_carts").doc(SID).delete();
      } else {
        db.collection("user_carts")
          .doc(SID)
          .set({
            items: JSON.stringify(cart),
          });
      }
    };
    try {
      await sendRequest();
    } catch (error) {}
  };
};

export const fetchData = (SID) => {
  return async (dispatch) => {
    const getData = async () => {
      const data = await db.collection("user_carts").doc(SID).get();
      return JSON.parse(data.data().items);
    };
    try {
      const cart = await getData();
      dispatch(
        basketActions.replaceCart({
          items: cart || [],
        })
      );
    } catch (error) {}
  };
};
