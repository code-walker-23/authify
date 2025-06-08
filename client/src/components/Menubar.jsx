import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Menubar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userData, setUserData, BACKEND_URL, setIsUserLoggedIn } =
    useContext(AppContext);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${BACKEND_URL}/logout`);

      if (response?.status === 200) {
        toast.success("Logout successfully!");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Logout failed!";
      toast.error(message);
    } finally {
      setIsUserLoggedIn(false);
      setUserData(null);
      navigate("/login");
    }
  };

  const handleVerifyEmail = async (email) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${BACKEND_URL}/send-otp`, { email });

      if (response.status === 200) {
        toast.success("Verification code sent to your email.");
        navigate("/email-verify");
      } else {
        toast.error(response?.statusText || "Failed to send verification code");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "An error occurred while sending OTP";
      toast.error(message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white px-4 py-3 shadow-sm">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Brand Section */}
        <div className="d-flex align-items-center gap-3">
          <img
            src={assets.authify_logo}
            alt="Authify Logo"
            style={{ width: "60px", height: "60px", objectFit: "contain" }}
          />
          <div>
            <div className="h4 fw-bold mb-0">Authify</div>
            <div className="text-muted small" style={{ marginTop: "-4px" }}>
              The key to secret
            </div>
          </div>
        </div>

        {userData ? (
          <div className="position-relative" ref={dropdownRef}>
            <div
              className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "40px",
                height: "40px",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setDropdownOpen((prev) => !prev)}
              role="button"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              tabIndex={0}
            >
              {userData?.name?.[0]?.toUpperCase()}
            </div>

            {dropdownOpen && (
              <div
                className="position-absolute shadow bg-white rounded p-2"
                style={{
                  top: "50px",
                  right: 0,
                  zIndex: 100,
                }}
              >
                {!userData.isAccountVerified && (
                  <div
                    className="dropdown-item py-1 px-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleVerifyEmail(userData?.email)}
                  >
                    Verify Email
                  </div>
                )}
                <div
                  className="dropdown-item py-1 px-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="btn btn-outline-dark rounded-pill px-3"
            onClick={() => navigate("/login")}
          >
            Login <i className="bi bi-arrow-right ms-2"></i>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Menubar;
