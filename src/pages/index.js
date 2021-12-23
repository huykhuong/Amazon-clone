import { getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkCookie } from "../../utils/retrieve_cookie_HOC";
import Banner from "../components/Banner";
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";
import { fetchData, sendCartData } from "../slices/basketActions";
import { cartChanged, selectItems } from "../slices/basketSlice.js";

export default function Home({ products, amazon_SID }) {
  const items = useSelector(selectItems);
  const changed = useSelector(cartChanged);
  const dispatch = useDispatch();

  useEffect(() => {
    if (changed) {
      dispatch(sendCartData(items, amazon_SID));
    }
  }, [items, dispatch]);

  useEffect(() => {
    dispatch(fetchData(amazon_SID));
  }, [dispatch]);

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      <Header />

      <main className="max-w-screen-2xl mx-auto">
        {/* {Banner} */}
        <Banner />
        {/* {ProductFeed} */}
        <ProductFeed products={products} />
      </main>
    </div>
  );
}

export const getServerSideProps = checkCookie(async (context) => {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  const session = await getSession(context);

  const { req } = context;

  return {
    props: {
      products,
      session,
      amazon_SID: req.cookies.amazon_SID || "",
    },
  };
});
