import "bootstrap/dist/css/bootstrap.css";

import BuildAxiosClient from "../api/build-client";

// https://nextjs.org/docs/advanced-features/custom-app
const AppComponent = ({ Component, pageProps, userIsAuthenticated }) => {
  const { email, userID } = pageProps;

  return (
    <div>
      <h1>Header</h1>
      <Component {...pageProps} />
    </div>
  );
};

// https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
// export async function getServerSideProps(appContext) {
AppComponent.getInitialProps = async (appContext) => {
  // Load up any global state that'll be needed to hydrate all pages
  const { data } = await BuildAxiosClient(appContext.ctx)
    .get("/api/users/current-user")
    .catch((e) => {
      console.log(`Failed to get initial props. Error: ${e.message}`);
    });

  // Trigger page specific props functions
  // Seems there's no need to do this as the component is still being called :)

  // Combine all the data
  if (data && data.currentUser) {
    return {
      userIsAuthenticated: data.currentUser.email ? true : false,
      pageProps: {
        email: data.currentUser.email,
        userID: data.currentUser.id,
      },
    };
  } else {
    // console.log(`User has no authenticated session.`);
    return {
      userIsAuthenticated: false,
      pageProps: { email: null, userID: null },
    };
  }
};

export default AppComponent;
