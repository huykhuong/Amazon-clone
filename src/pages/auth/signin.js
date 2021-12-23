import { getProviders } from "next-auth/react";
import Header from "../../components/Header";
import { signIn } from "next-auth/react";

function signin({ providers }) {
  return (
    <div>
      <Header />

      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}

export default signin;
