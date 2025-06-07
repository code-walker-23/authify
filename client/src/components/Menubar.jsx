import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Menubar = () => {
  const navigate = useNavigate();

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

        <div
          className="btn btn-outline-dark rounded-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login <i className="bi bi-arrow-right ms-2"></i>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
