import '@/styles/globals.css';
import jwt from 'jsonwebtoken';

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

App.getInitialProps = async (appContext) => {
  const { Component, ctx } = appContext;

  let componentProps = {};
  let user = null;
  let role = 'user';

  if (Component.getInitialProps) {
    componentProps = await Component.getInitialProps(ctx);
  }

  if (ctx.req) {
    const { token = null } = ctx.req.cookies || {};

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_AUTH);
        user = decoded;
        role = decoded.role || 'user';
        ctx.req.user = user;
        ctx.req.role = role;
      } catch (error) {
        console.error("JWT verification failed:", error.message);
      }
    }
  }

  return {
    pageProps: {
      ...componentProps,
      user,
      role,
    },
  };
};

export default App;