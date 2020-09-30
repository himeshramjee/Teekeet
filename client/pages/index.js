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
      <ul>
        <li>
          <a href="/auth/sign-up">Sign up</a>
        </li>
        <li>
          <a href="/auth/sign-in">Sign in</a>
        </li>
        {email && (
          <li>
            <a href="/auth/sign-out">Sign out</a>
          </li>
        )}
      </ul>
    </div>
  );
};

// export const getServerSideProps = async (context) => {
// TeekeetLandingPage.getInitialProps = async (context) => {
export async function getServerSideProps(context) {
  const { data } = await BuildAxiosClient(context)
    .get("/api/users/current-user")
    .catch((e) => {
      console.log(`Failed to get initial props. Error: ${e.message}`);
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
