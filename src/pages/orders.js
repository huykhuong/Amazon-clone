import moment from "moment";
import { useSession } from "next-auth/react";
import db from "../../firebase";
import Header from "../components/Header";
import Order from "../components/Order";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartChanged, selectItems } from "../slices/basketSlice";
import { fetchData } from "../slices/basketActions";
import { checkCookie } from "../../utils/retrieve_cookie_HOC";

const Orders = ({ orders, amazon_SID }) => {
  const { data: session } = useSession();
  const changed = useSelector(cartChanged);
  const items = useSelector(selectItems);
  const dispatch = useDispatch();

  useEffect(() => {
    if (changed) {
      dispatch(sendCartData(items, amazon_SID));
    }
  }, [items]);

  useEffect(() => {
    dispatch(fetchData(amazon_SID));
  }, [dispatch]);

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>
        {session ? (
          <h2>{orders.length} Order(s)</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}
        <div className="mt-5 space-y-4">
          {orders?.map((order) => (
            <Order
              key={order.id}
              items={order.items}
              id={order.id}
              amount={order.amount}
              amountShipping={order.amountShipping}
              timestamp={order.timestamp}
              images={order.images}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;

export const getServerSideProps = checkCookie(async (context) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  //Get the users logged in credentials...
  const session = await getSession(context);
  const { req } = context;

  if (!session) {
    return {
      props: {
        amazon_SID: req.cookies.amazon_SID || "",
      },
    };
  }

  //Get orders from Firebase db
  const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  //Transformed orders to show on front end
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );

  return {
    props: {
      orders,
      session,
      amazon_SID: req.cookies.amazon_SID || "",
    },
  };
});
