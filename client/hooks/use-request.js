import axios from "axios";
import { useState } from "react";

const useRequestHook = ({ pageID, url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    setErrors(null);
    await axios[method](url, body)
      .then((response) => {
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.errors) {
          setErrors(
            <div className="alert alert-danger">
              <ul className={pageID + "-errors-list"}>
                {e.response.data.errors.map((err) => (
                  <li key={err.message}>{err.message}</li>
                ))}
              </ul>
            </div>
          );
        } else {
          console.log(
            `Failed to complete useRequest. Error: ${
              e.message
            }. Http status code: ${
              e.response ? e.response.status : "not available"
            }`
          );
        }
      });
  };

  return { doRequest, errors };
};

export default useRequestHook;
