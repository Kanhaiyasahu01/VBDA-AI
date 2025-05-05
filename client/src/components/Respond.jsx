import { useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { FiCheck, FiX, FiMail } from "react-icons/fi";

const Respond = () => {
  const location = useLocation();
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEmail(queryParams.get("email"));
  }, [location.search]);

  const handleResponse = async (type) => {
    if (!email) {
      setStatus("Invalid or missing email address.");
      return;
    }

    setLoading(true);
    
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center w-full max-w-md border border-gray-200">
        <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiMail className="h-8 w-8 text-indigo-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">You're Invited!</h2>
        <p className="text-gray-500 mb-6">We'd love to have you join us.</p>
        
        {status ? (
          <div className="p-4 rounded-md bg-green-50 text-green-700">
            {status}
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">Please choose one of the following options:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleResponse("rsvp")}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm transition-colors disabled:bg-indigo-300"
              >
                <FiCheck className="mr-2" /> Accept Invite
              </button>
              <button
                onClick={() => handleResponse("unsubscribe")}
                disabled={loading}
                className="flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition-colors disabled:bg-red-300"
              >
                <FiX className="mr-2" /> Unsubscribe
              </button>
            </div>
            
            {loading && (
              <p className="mt-4 text-sm text-gray-500">Processing your request...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Respond;