import { useSession } from "next-auth/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import CheckoutProducts from "../components/CheckoutProducts";
import Header from "../components/Header";
import { cartChanged, selectItems, selectTotal } from "../slices/basketSlice";
import Currency from "react-currency-formatter";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect } from "react";
import { fetchData, sendCartData } from "../slices/basketActions";
const stripePromise = loadStripe(process.env.stripe_public_key);

const checkout = ({ amazon_SID }) => {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const changed = useSelector(cartChanged);
  const { data: session } = useSession();

  const dispatch = useDispatch();

  useEffect(() => {
    if (changed) {
      dispatch(sendCartData(items, amazon_SID));
    }
  }, [items, dispatch]);

  useEffect(() => {
    dispatch(fetchData(amazon_SID));
  }, [dispatch]);

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    //Call our own backend to create a checkout session..
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      SID: amazon_SID,
      items: items,
      email: session.user.email,
    });

    //Redirect user/customer to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) alert(result.error.message);
  };

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* {Left} */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col space-y-10 p-5 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0 ? "Your Basket is empty" : "Shopping Basket"}
            </h1>
            {items.map((item) => (
              <CheckoutProducts
                key={item.id}
                id={item.id}
                title={item.title}
                rating={item.rating}
                price={item.price}
                description={item.description}
                category={item.category}
                image={item.image}
                hasPrime={item.hasPrime}
              />
            ))}
          </div>
        </div>

        {/* {Right} */}
        <div className="flex flex-col p-10 shadow-md bg-white">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items) :{" "}
                <span className="font-bold">
                  <Currency quantity={total} currency="VND" />
                </span>
              </h2>

              <button
                onClick={createCheckoutSession}
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {!session ? "Sign in to checkout" : "Proceed to checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { req } = context;

  return {
    props: {
      amazon_SID: req.cookies.amazon_SID || "",
    },
  };
}

export default checkout;
