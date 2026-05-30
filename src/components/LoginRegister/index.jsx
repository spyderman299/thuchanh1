import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const emptyRegister = {
  login_name: "",
  password: "",
  password2: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

export default function LoginRegister() {
  const { login, register } = useUser();
  const navigate = useNavigate();

  // ---- Login form state ----
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ---- Register form state ----
  const [reg, setReg] = useState(emptyRegister);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleLogin = async () => {
    setLoginError("");
    if (!loginName.trim()) {
      setLoginError("Please enter your login name.");
      return;
    }
    try {
      const u = await login(loginName.trim(), loginPassword);
      navigate(`/users/${u._id}`);
    } catch (err) {
      setLoginError(err.message || "Login failed.");
    }
  };

  const updateReg = (field) => (e) =>
    setReg((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async () => {
    setRegisterError("");
    setRegisterSuccess("");

    if (!reg.login_name.trim()) return setRegisterError("Login name is required.");
    if (!reg.first_name.trim()) return setRegisterError("First name is required.");
    if (!reg.last_name.trim()) return setRegisterError("Last name is required.");
    if (!reg.password) return setRegisterError("Password is required.");
    if (reg.password !== reg.password2) {
      return setRegisterError("The two passwords do not match.");
    }

    try {
      await register({
        login_name: reg.login_name.trim(),
        password: reg.password,
        first_name: reg.first_name.trim(),
        last_name: reg.last_name.trim(),
        location: reg.location,
        description: reg.description,
        occupation: reg.occupation,
      });
      setRegisterSuccess(
        `Account "${reg.login_name.trim()}" created! You can now log in.`
      );
      setReg(emptyRegister); // clear the form on success
    } catch (err) {
      setRegisterError(err.message || "Registration failed.");
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", p: 3 }}>
      {/* ---------------- Login ---------------- */}
      <Paper sx={{ p: 3, flex: "1 1 320px", minWidth: 300 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
        <TextField
          label="Login name"
          fullWidth
          margin="normal"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>

      {/* ---------------- Register ---------------- */}
      <Paper sx={{ p: 3, flex: "1 1 320px", minWidth: 300 }}>
        <Typography variant="h5" gutterBottom>
          Create a new account
        </Typography>
        {registerError && (
          <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>
        )}
        {registerSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>{registerSuccess}</Alert>
        )}
        <TextField label="Login name *" fullWidth margin="dense"
          value={reg.login_name} onChange={updateReg("login_name")} />
        <TextField label="First name *" fullWidth margin="dense"
          value={reg.first_name} onChange={updateReg("first_name")} />
        <TextField label="Last name *" fullWidth margin="dense"
          value={reg.last_name} onChange={updateReg("last_name")} />
        <TextField label="Location" fullWidth margin="dense"
          value={reg.location} onChange={updateReg("location")} />
        <TextField label="Occupation" fullWidth margin="dense"
          value={reg.occupation} onChange={updateReg("occupation")} />
        <TextField label="Description" fullWidth margin="dense" multiline
          value={reg.description} onChange={updateReg("description")} />
        <Divider sx={{ my: 2 }} />
        <TextField label="Password *" type="password" fullWidth margin="dense"
          value={reg.password} onChange={updateReg("password")} />
        <TextField label="Re-enter password *" type="password" fullWidth margin="dense"
          value={reg.password2} onChange={updateReg("password2")} />
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          Register Me
        </Button>
      </Paper>
    </Box>
  );
}
