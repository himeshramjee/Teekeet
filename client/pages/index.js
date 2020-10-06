import BuildAxiosClient from "../api/build-client";

const TeekeetLandingPage = (props) => {
  const { email, userID } = props;
  return (
    <div>
      <h1>Landing Page</h1>
      <p>
        <i>
          Current user:&nbsp;
          {userID && email ? "Your email is " + email : "Please sign up/in"}.
        </i>
      </p>
    </div>
  );
};

// export const getServerSideProps = async (context) => {
// TeekeetLandingPage.getInitialProps = async (context) => {
export async function getServerSideProps(context) {
  if (!process.env.INGRESS_URI) {
    throw new Error(
      "Application failed to initialize. INGRESS_URI environment variable is missing."
    );
  }

  let data;

  await BuildAxiosClient(context)
    .get("/api/users/current-user")
    .then((response) => {
      data = response.data;
    })
    .catch((e) => {
      console.log(
        `Failed to get initial server side props. Error: ${
          e.message
        }. Http status code: ${
          e.response ? e.response.status : "not available"
        }`
      );
    });

  if (data && data.currentUser) {
    // console.log(`Data for initial props: ${data.currentUser.email}`);
    return {
      props: {
        email: data.currentUser.email,
        userID: data.currentUser.id,
      },
    };
  } else {
    // console.log(`User has no authenticated session.`);
    return { props: { email: null, userID: null } };
  }
}

export default TeekeetLandingPage;
