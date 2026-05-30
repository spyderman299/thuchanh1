import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import fetchModel from "../../lib/fetchModelData";
import { apiUpload } from "../../lib/api";

export default function TopBar() {
  const { user, logout, bumpRefresh } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [context, setContext] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  // Build the right-side context label from the current route.
  useEffect(() => {
    const path = location.pathname;
    let active = true;
    const setUserLabel = (prefix, id) => {
      fetchModel(`/user/${id}`)
        .then((u) => active && setContext(`${prefix}${u.first_name} ${u.last_name}`))
        .catch(() => active && setContext(""));
    };
    if (path.startsWith("/users/")) {
      setUserLabel("", path.split("/")[2]);
    } else if (path.startsWith("/photos/")) {
      setUserLabel("Photos of ", path.split("/")[2]);
    } else {
      setContext("");
    }
    return () => {
      active = false;
    };
  }, [location.pathname, user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login-register");
  };

  const handleFileChosen = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    const form = new FormData();
    form.append("uploadedphoto", file);
    try {
      await apiUpload("/photos/new", form);
      setSnack({ open: true, msg: "Photo uploaded!", severity: "success" });
      bumpRefresh();
      navigate(`/photos/${user._id}`);
    } catch (err) {
      setSnack({ open: true, msg: err.message || "Upload failed", severity: "error" });
    }
  };

  return (
    <AppBar position="absolute">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <Typography variant="h6" color="inherit">
            NGUYỄN LÊ HOÀNG
          </Typography>
          {context && (
            <Typography variant="subtitle1" color="inherit">
              {context}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              <Typography variant="h6" color="inherit">
                Hi {user.first_name}
              </Typography>
              <Button color="inherit" variant="outlined" onClick={() => fileInputRef.current.click()}>
                Add Photo
              </Button>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChosen}
              />
            </>
          ) : (
            <Typography variant="h6" color="inherit">
              Please Login
            </Typography>
          )}
        </Box>
      </Toolbar>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </AppBar>
  );
}
