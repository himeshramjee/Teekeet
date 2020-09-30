import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { useEffect } from "react";

const signOutComponent = () => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/sign-out",
    method: "post",
    onSuccess: ({ redirectTo }) => {
      Router.push(redirectTo);
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <h5>Signing you out...G'Bye for now :)</h5>
      <i>
        Wait! Lemme&nbsp;
        <a href="/auth/sign-in">sign in</a>
        &nbsp;again.
      </i>
    </div>
  );
};

export default signOutComponent;
