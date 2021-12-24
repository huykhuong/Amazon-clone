import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import "firebase/firestore";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  // adapter: FirebaseAdapter(db),

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session.user.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.id = token.sub;
      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      const userDocRef = await app.firestore().collection("users").doc(user.id);
      const doc = await userDocRef.get();
      if (!doc.exists) {
        userDocRef.set({
          email: user.email,
          name: user.name,
          image: user.image,
        });
      } else {
      }
      return true;
    },
  },
});

/* 
  const docRef = await addDoc(collection(db, 'posts'), {
    username: session.user.username,
    caption: captionRef.current.value,
    profileImg: session.user.image,
    timestamp: serverTimestamp()
  })
*/
