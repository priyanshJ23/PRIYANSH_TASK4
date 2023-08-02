import React, { Component } from "react";

import { BrowserRouter as Router, Routes, Route ,Switch} from "react-router-dom";
import Navbar from "./Components/Layout/Navbar";
import Landing from "./Components/Layout/Landing";
import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";

import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./Components/private-route/PrivateRoute";
import Dashboard from "./Components/dashboard/Dashboard";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthtoken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000; 
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <Router>
          <Navbar />
      <Routes>
          <Route exact path="/" element={<Landing/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/dashboard" element={<Dashboard/>}/>
      </Routes>
      </Router>
      </div>
      </Provider>
    );
  }
}
export default App;