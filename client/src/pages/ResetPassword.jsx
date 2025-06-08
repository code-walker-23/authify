import { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const { BACKEND_URL } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return toast.error("Only digits allowed");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const val = Number(otp[index] || 0);
      const newVal = e.key === "ArrowUp" ? (val + 1) % 10 : (val - 1 + 10) % 10;
      handleOtpChange(String(newVal), index);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/send-reset-otp?email=${email}`
      );
      console.log(response);
      if (response.status == 200) {
        toast.success("OTP sent to your email!");
        setIsEmailSent(true);
      } else {
        toast.error("User is not registered");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6 || !/^\d{6}$/.test(finalOtp)) {
      return toast.error("Enter a valid 6-digit OTP");
    }
    if (!newPassword) return toast.error("Password required");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/reset-password`, {
        email,
        otp: finalOtp,
        newPassword,
      });
      if (response.status == 200) {
        toast.success("Password reset successful! You can now log in.");
        navigate("/login");
      } else {
        toast.error("Enter correct OTP!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const updatedOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      updatedOtp[i] = pastedData[i] || "";
    }
    setOtp(updatedOtp);
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{
        background: "linear-gradient(90deg, #6a5af9 0%, #8268f9 100%)",
      }}
    >
      <Link
        to="/"
        className="d-flex align-items-center gap-2 text-decoration-none position-absolute top-0 start-0 p-4"
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

      <div className="rounded p-4 bg-white w-100" style={{ maxWidth: "400px" }}>
        {!isEmailSent ? (
          <>
            <h4 className="mb-2 text-center">Reset Password</h4>
            <p className="mb-4 text-center">
              Enter your registered email address
            </p>
            <form onSubmit={handleSendOtp}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h4 className="mb-2 text-center">Enter OTP</h4>
            <p className="mb-3 text-center">
              Enter the 6-digit code sent to your email
            </p>
            <form onSubmit={handleResetPassword}>
              <div
                className="d-flex justify-content-between mb-4"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    className="form-control text-center fs-4"
                    style={{ width: "45px" }}
                  />
                ))}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
