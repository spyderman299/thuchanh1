import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Alert } from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

function LoginRegister({ onLogin }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    setErr("");
    try {
      const res = await fetchModel("/admin/login", {
        method: "POST",
        body: { login_name: name, password: pass },
      });
      onLogin(res.data);
    } catch (e) {
      setErr(e.message || "Sai thông tin đăng nhập");
    }
  };

  return (
    <Box style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>Đăng nhập</Typography>
        {err && <Alert severity="error" style={{ marginBottom: 10 }}>{err}</Alert>}
        <TextField label="Tên đăng nhập" fullWidth margin="normal"
          value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Mật khẩu" type="password" fullWidth margin="normal"
          value={pass} onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        <Button variant="contained" fullWidth style={{ marginTop: 10 }}
          onClick={handleLogin}>
          Đăng nhập
        </Button>
      </Paper>
    </Box>
  );
}
export default LoginRegister;
