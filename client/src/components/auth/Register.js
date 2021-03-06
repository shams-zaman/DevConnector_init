import React from "react";
import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { setAlert } from "../../action/alert";
import { register } from "../../action/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;
  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Not Match", "danger");
    } else {
      register({ name, email, password });
    }
  };
  //Redirect
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => onChange(e)}
              placeholder="Name"
              name="name"
            />
          </div>
          <div className="form-group">
            <input
              value={email}
              onChange={(e) => onChange(e)}
              type="email"
              placeholder="Email Address"
              name="email"
            />
            <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
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
          <div className="form-group">
            <input
              value={password2}
              onChange={(e) => onChange(e)}
              type="password"
              placeholder="Confirm Password"
              name="password2"
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </Fragment>
  );
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, register })(Register);
//

//

//

//

//

// const newUser = { name, email, password, password2 };
// try {
//   const config = {
//     headers: {
//       "content-Type": "Application/json",
//     },
//   };
//   //TODO: NewUser is an Object
//   const body = JSON.stringify(newUser);
//   const res = await axios.post("/api/users", body, config);
//   console.log(res.data);
// } catch (err) {
//   console.error(err.response.data);
// }
