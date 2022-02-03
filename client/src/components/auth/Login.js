import React from "react";
import { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../action/auth";
import PropTypes from "prop-types";

function Login({ login, isAuthenticated }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    login({ email, password });
  };
  //Redirect
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  //  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              value={email}
              onChange={(e) => onChange(e)}
              type="email"
              placeholder="Email Address"
              name="email"
            />
          </div>
          <div className="form-group">
            <input
              value={password}
              onChange={(e) => onChange(e)}
              type="password"
              placeholder="Password"
              name="password"
            />
          </div>

          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Dont have an account? <Link to="/Register">Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
}
Login.prototype = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { login })(Login);
