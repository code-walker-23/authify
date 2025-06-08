import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [isCreateAccount, setCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { BACKEND_URL, getUserData, setIsUserLoggedIn } =
    useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios.defaults.withCredentials = true;

    try {
      let response;

      if (isCreateAccount) {
        response = await axios.post(`${BACKEND_URL}/register`, {
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (response.status === 201) {
          toast.success(
            "Account created successfully! Please verify your email."
          );
          setCreateAccount(false);
        } else {
          toast.error("Email already exist!");
        }
      } else {
        response = await axios.post(`${BACKEND_URL}/login`, {
          email: email.trim(),
          password,
        });

        if (response?.status === 200) {
          setIsUserLoggedIn(true);
          await getUserData();
          toast.success("Login successful!");
          navigate("/");
        }
      }
    } catch (error) {
      const errData = error?.response?.data;

      if (errData && typeof errData === "object") {
        // If the object has a 'message' field, show only that (authentication error or generic error)
        if ("message" in errData) {
          toast.error(errData.message);
        } else {
          // Otherwise, assume it's a validation error object: show the first message only
          const firstError = Object.values(errData).find(
            (val) => typeof val === "string"
          );
          if (firstError) {
            toast.error(firstError);
          } else {
            // Fallback generic message if no string found
            toast.error("Validation error occurred");
          }
        }
      } else {
        // If errData is not an object, show generic fallback
        const message = errData || "Something went wrong!";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card p-4 shadow rounded-4 bg-white"
      style={{ maxWidth: "400px", width: "100%", border: "none" }}
    >
      <h2 className="text-center fw-bold mb-2">
        {isCreateAccount ? "Register" : "Login"}
      </h2>

      <p className="text-muted text-center mb-4">
        {isCreateAccount
          ? "Join us by creating your free account"
          : "Welcome back! Please login to continue."}
      </p>

      <form onSubmit={handleSubmit}>
        {isCreateAccount && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              className="form-control form-control-lg"
              placeholder="John Doe"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            className="form-control form-control-lg"
            placeholder="you@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            className="form-control form-control-lg"
            placeholder="••••••••"
            required
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {!isCreateAccount && (
          <div className="d-flex justify-content-end mb-3">
            <Link className="text-decoration-none small" to="/reset-password">
              Forgot Password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-semibold"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : isCreateAccount
            ? "Create Account"
            : "Login"}
        </button>
      </form>

      <div className="text-center mt-4">
        <span className="text-muted">
          {isCreateAccount
            ? "Already have an account?"
            : "Don't have an account?"}
        </span>{" "}
        <button
          type="button"
          className="btn btn-link p-0 fw-semibold"
          onClick={() => setCreateAccount((prev) => !prev)}
        >
          {isCreateAccount ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
