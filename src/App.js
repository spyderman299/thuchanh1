import "./App.css";
import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import { setCurrentUser } from "./lib/fetchModelData";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (u) => { setUser(u); setCurrentUser(u); };
  const handleLogout = () => { setUser(null); setCurrentUser(null); };

  return (
    <Router>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar user={user} onLogout={handleLogout} />
        </Grid>
        <div className="main-topbar-buffer" />
        {!user ? (
          <Grid item xs={12}>
            <Paper className="main-grid-item">
              <LoginRegister onLogin={handleLogin} />
            </Paper>
          </Grid>
        ) : (
          <>
            <Grid item sm={3}>
              <Paper className="main-grid-item"><UserList /></Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/users/:userId" element={<UserDetail />} />
                  <Route path="/photos/:userId" element={<UserPhotos />} />
                  <Route path="*" element={<Navigate to={`/users/${user._id}`} />} />
                </Routes>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Router>
  );
};
export default App;
