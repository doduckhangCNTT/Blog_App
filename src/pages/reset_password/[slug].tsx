import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { resetPassword } from "../../redux/actions/userAction";
import { FormSubmit } from "../../utils/TypeScript";

const ResetPassword = () => {
  const token = useParams().slug;
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [cf_password, setCfPassword] = useState("");
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    if (!token) return;
    dispatch(resetPassword(password, cf_password, token));
  };

  return (
    <div className="auth_page">
      <form className="auth_box" onSubmit={handleSubmit}>
        <h3 className="text-uppercase text-center mb-4">Reset Password</h3>

        <div className="form-group my-2">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="pass">
            <input
              type={typePass ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small onClick={() => setTypePass(!typePass)}>
              {typePass ? "Hide" : "Show"}
            </small>
          </div>
        </div>

        <div className="form-group my-2">
          <label htmlFor="password" className="form-label">
            Confirm Password
          </label>
          <div className="pass">
            <input
              type={typeCfPass ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              value={cf_password}
              onChange={(e) => setCfPassword(e.target.value)}
            />
            <small onClick={() => setTypeCfPass(!typeCfPass)}>
              {typeCfPass ? "Hide" : "Show"}
            </small>
          </div>
        </div>

        <button type="submit" className="btn btn-dark w-100 mt-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
