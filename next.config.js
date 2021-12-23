module.exports = {
  images: {
    domains: ["links.papareact.com", "fakestoreapi.com"],
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  },
  i18n: {
    locales: ["fr", "vn", "en"],
    defaultLocale: "en",
  },
};
