import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const EmailVerify = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { BACKEND_URL, getUserData } = useContext(AppContext);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      setError("Only numeric digits are allowed");
      return;
    }
    setError("");

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const updateOtpDigit = (index, newDigit) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = newDigit.toString();
    setOtp(updatedOtp);
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        updateOtpDigit(index, "");
      }
    }

    if (key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (key === "ArrowUp") {
      const current = otp[index] === "" ? 0 : parseInt(otp[index]);
      updateOtpDigit(index, (current + 1) % 10);
    }

    if (key === "ArrowDown") {
      const current = otp[index] === "" ? 0 : parseInt(otp[index]);
      updateOtpDigit(index, (current + 9) % 10); // decrement
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      setError("Only numeric digits are allowed");
      return;
    }

    const updatedOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      updatedOtp[i] = pastedData[i] || "";
    }
    setOtp(updatedOtp);
    setError("");
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  const handleVerifyEmail = async () => {
    const OTP_LENGTH = 6;

    if (otp.join("").length !== OTP_LENGTH) {
      toast.error(`OTP must be ${OTP_LENGTH} digits long`);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/verify-otp`, {
        otp: otp.join(""),
      });

      if (response.status === 200) {
        toast.success("Email verified successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error(response?.statusText || "Verification failed");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Invalid OTP or server error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  console.log(otp, typeof otp);

  return (
    <div
      className="email-verify-container d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative px-3"
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

      <div
        className="p-4 p-md-5 rounded shadow bg-white w-100"
        style={{ maxWidth: "400px" }}
      >
        <h4 className="text-center fw-bold mb-2">Email Verification</h4>
        <p className="text-center text-muted mb-4">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="row g-2 justify-content-center mb-3">
          {otp.map((digit, i) => (
            <div key={i} className="col-2">
              <input
                ref={(el) => (inputRefs.current[i] = el)}
                maxLength={1}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={digit}
                className="form-control text-center fs-4"
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                style={{ height: "3.5rem", fontWeight: "sm-bold" }}
                onPaste={handlePaste}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="text-danger text-center small mb-3">{error}</div>
        )}

        <button
          className="btn btn-primary w-100 fw-semibold py-2"
          onClick={handleVerifyEmail}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
