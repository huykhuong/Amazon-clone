import { buffer } from "micro";
import * as admin from "firebase-admin";

//Secure a connection to FIREBASE from the backend
const serviceAccount = require("../../../permissions.json");
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

//Establish a connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      buyer_name: session.shipping.name,
      address: `${session.shipping.address.line1}, ${session.shipping.address.city}`,
      amount: session.amount_total / 1000,
      amount_shipping: session.total_details.amount_shipping / 1000,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(
        `SUCCESS: Order ${session.id} had been added to the database`
      );
    })
    .catch((err) => res.status(400).send(`${err.message}`));
};

const deleteUserCart = (SID) => {
  app.firestore().collection("user_carts").doc(SID).delete();
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const signature = req.headers["stripe-signature"];

    let event;

    //Verify that the EVENT posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    //Handle the checkout.session completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      deleteUserCart(session.metadata.SID);

      //Fulfil the order...
      fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
