import "./App.css";

import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import { UserProvider, useUser } from "./contexts/UserContext";

// Redirect to the login view if no user is logged in (handles deep links).
function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login-register" replace />;
  return children;
}

function AppLayout() {
  const { user } = useUser();

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <div className="main-topbar-buffer" />

        {/* The user list sidebar is only shown when a user is logged in. */}
        {user && (
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
        )}

        <Grid item sm={user ? 9 : 12}>
          <Paper className="main-grid-item">
            <Routes>
              <Route path="/login-register" element={<LoginRegister />} />
              <Route
                path="/users/:userId"
                element={<ProtectedRoute><UserDetail /></ProtectedRoute>}
              />
              <Route
                path="/photos/:userId"
                element={<ProtectedRoute><UserPhotos /></ProtectedRoute>}
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Typography style={{ padding: 20 }}>
                      Select a user from the list on the left.
                    </Typography>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <Navigate
                    to={user ? `/users/${user._id}` : "/login-register"}
                    replace
                  />
                }
              />
              <Route
                path="*"
                element={
                  <Navigate to={user ? "/users" : "/login-register"} replace />
                }
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const App = () => (
  <Router>
    <UserProvider>
      <AppLayout />
    </UserProvider>
  </Router>
);

export default App;
