import axios from "axios";

// FIXME: This may no longer be needed given I'm using the new `getServerSideProps` method.
// Leaving it in place for now as I'm not sure if it may be needed further into the online course I'm doing.
const BuildAxiosClient = ({ req }) => {
  if (typeof window === "undefined") {
    // execute in context of server side rendering
    // This executes within a container and since we're making a cross service call to a service in a different namespace we need to use an explicit FQDN.
    // console.log("Returning axios with server context/url.");
    return axios.create({
      baseURL: process.env.INGRESS_URI,
      headers: req.headers,
    });
  } else {
    // execute in context of client browser side rendering
    // console.log("Returning axios with browser context/url.");
    return axios.create({
      baseURL: "/",
    });
  }
};

export default BuildAxiosClient;
