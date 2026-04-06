// client/src/App.jsx — React Router v5

import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import useStore from "./store/useStore";
import { getMe } from "./api/api";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TripWorkspace from "./pages/TripWorkspace";

// Protected route wrapper
function PrivateRoute({ component: Component, ...rest }) {
  const token = useStore((s) => s.token);
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/auth" />
      }
    />
  );
}

export default function App() {
  const { token, setUser } = useStore();

  // On app load, restore user from token
  useEffect(() => {
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => useStore.getState().logout());
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/trip/:tripId" component={TripWorkspace} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}