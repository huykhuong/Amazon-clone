import cookie from "cookie";
import uniqueString from "unique-string";

export function checkCookie(gssp) {
  return async (context) => {
    const { req, res } = context;
    const SID = req.cookies.amazon_SID;

    // Add logic to extract token from `req.headers.cookie`
    if (!SID) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("amazon_SID", uniqueString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          maxAge: 86400 * 365,
          sameSite: "strict",
          path: "/",
        })
      );
    }

    return await gssp(context); // Continue on to call `getServerSideProps` logic
  };
}
