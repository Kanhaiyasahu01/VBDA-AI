// pages/Respond.jsx
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const Respond = () => {
  const location = useLocation();
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEmail(queryParams.get("email"));
  }, [location.search]);

  const handleResponse = async (type) => {
    if (!email) {
      setStatus("Invalid or missing email address.");
      return;
    }

    try {
      if (type === "rsvp") {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rsvp`, { email, response: true });
        setStatus("You have successfully RSVP'd.");
      } else if (type === "unsubscribe") {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/unsubscribe`, { email });
        setStatus("You have unsubscribed.");
      }
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 text-center w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">You're Invited!</h2>
        {status ? (
          <p className="text-green-600 font-medium">{status}</p>
        ) : (
          <>
            <p className="mb-6">Please choose one of the following options:</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleResponse("rsvp")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Accept Invite
              </button>
              <button
                onClick={() => handleResponse("unsubscribe")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Unsubscribe
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Respond;
