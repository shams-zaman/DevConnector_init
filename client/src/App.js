import { Fragment, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
//Redux
import { Provider } from "react-redux";
import store from "./store";

import { loadUser } from "./action/auth";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Alert />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute component={Dashboard} />}
            />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
