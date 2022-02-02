import React from "react";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
// import { connect } from "react-redux";
// import { login } from "../../action/auth";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //              D-Sturcturing [formData.name]
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  //                Submit

  const onSubmit = async (e) => {
    e.preventDefault();
    //            Submit...
  };
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

export default Login;

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
