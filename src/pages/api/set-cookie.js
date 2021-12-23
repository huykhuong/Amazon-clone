import cookie from "cookie";

export default (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("amazon_SID", req.body, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 86400 * 365,
      sameSite: "strict",
      path: "/",
    })
  );

  res.statusCode = 200;
  res.json({ success: true });
};
