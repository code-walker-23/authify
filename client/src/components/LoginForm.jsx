import React from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ isCreateAccount, setCreateAccount }) => {
  return (
    <div
      className="card p-4 shadow rounded-4 bg-white"
      style={{
        maxWidth: "400px",
        width: "100%",
        border: "none",
      }}
    >
      <h2 className="text-center fw-bold mb-2">
        {isCreateAccount ? "Register" : "Login"}
      </h2>

      <p className="text-muted text-center mb-4">
        {isCreateAccount
          ? "Join us by creating your free account"
          : "Welcome back! Please login to continue."}
      </p>

      <form>
        {isCreateAccount && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="John Doe"
              required
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
            className="form-control form-control-lg"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control form-control-lg"
            placeholder="••••••••"
            required
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
        >
          {isCreateAccount ? "Create Account" : "Login"}
        </button>
      </form>

      {/* Switch between login/register */}
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
