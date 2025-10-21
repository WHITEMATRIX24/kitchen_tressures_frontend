import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg3.jpg"; // the image you provided

export default function Login() {
  // Pre-filled dummy credentials
  const [username, setUsername] = useState("ERPID");
  const [password, setPassword] = useState("ERPID@123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "ERPID" && password === "ERPID@123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard", { state: { username } });
    } else {
      setError("Invalid username or password.");
      alert("Invalid username or password");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="w-1/2">
        <img
          src={bg}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-[70%] max-w-md relative -mt-16"> {/* lifted slightly up */}
          <h1 className="text-5xl font-semibold font-roboto text-[#007bff] mb-6">
            Welcome,
          </h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-[#007bff] transition text-gray-700"
            />
          </div>

          <div className="mb-8">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-[#007bff] transition text-gray-700"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            Login
          </button>

          <p className="text-gray-400 text-xs mt-8 text-center">
            Use the demo credentials above to continue
          </p>
        </div>
      </div>
    </div>
  );
}
