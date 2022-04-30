import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginPass from "../components/auth/LoginPass";
import LoginSMS from "../components/auth/LoginSMS";
import SocialLogin from "../components/auth/SocialLogin";
import { RootStore } from "../utils/TypeScript";

const Login = () => {
  const [sms, setSms] = useState(false);
  const { search } = useLocation();
  const navigate = useNavigate();

  const { auth } = useSelector((state: RootStore) => state);

  useEffect(() => {
    if (auth.access_token) {
      let url = search.replace("?", "/");
      navigate(url ? url : "/");
    }
  }, [auth.access_token, navigate, search]);

  return (
    <div className="auth_page">
      <div className="auth_box">
        <h3 className="text-uppercase text-center mb-4">Login</h3>

        {/* Đăng nhập với google login */}
        <SocialLogin />

        {sms ? <LoginSMS /> : <LoginPass />}

        <small className="row my-2 text-primary" style={{ cursor: "pointer" }}>
          <span className="col-6">
            <Link to="/forgot_password">Forgot password?</Link>
          </span>

          <span className="col-6 text-end" onClick={() => setSms(!sms)}>
            {sms ? "Sign in with password" : "Sign in with SMS"}
          </span>
        </small>

        <p>
          You don't have an account?
          <Link to={`/register${search}`} style={{ color: "crimson" }}>
            {` Register Now`}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
