import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const [isCreateAccount, setCreateAccount] = useState(false);

  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(90deg, #6a5af9 0%, #8268f9 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
        }}
      >
        <Link
          to="/"
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <span
            className="d-flex justify-content-center align-items-center rounded-circle"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            <img
              src={assets.authify_logo}
              alt="Authify logo"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          </span>
          <span className="fw-bold fs-4 text-light">Authify</span>
        </Link>
      </div>

      {/* Form */}
      <LoginForm
        isCreateAccount={isCreateAccount}
        setCreateAccount={setCreateAccount}
      />
    </div>
  );
};

export default Login;
