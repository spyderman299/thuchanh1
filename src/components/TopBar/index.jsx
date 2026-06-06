import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

function TopBar({ user, onLogout }) {
  const handleLogout = async () => {
    try { await fetchModel("/admin/logout", { method: "POST" }); } catch (e) {}
    onLogout();
  };

  return (
    <AppBar position="absolute">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="h5">Photo App</Typography>
        <Box>
          {user ? (
            <>
              <Typography component="span" style={{ marginRight: 15 }}>
                Hi {user.first_name}
              </Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography>Please Login</Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default TopBar;
