import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";

export default function TopBar() {
  const location = useLocation();
  const path = location.pathname;
  let contextStr = "Trang chủ";

  if (path.startsWith("/users/")) {
    const userId = path.split("/")[2];
    const user = models.userModel(userId);
    if (user) contextStr = `Thông tin của ${user.first_name} ${user.last_name}`;
  } else if (path.startsWith("/photos/")) {
    const userId = path.split("/")[2];
    const user = models.userModel(userId);
    if (user) contextStr = `Ảnh của ${user.first_name} ${user.last_name}`;
  } else if (path === "/users") {
    contextStr = "Danh sách người dùng";
  }

  return (
    <AppBar position="absolute">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">
          NGUYỄN LÊ HOÀNG
        </Typography>
        <Typography variant="h6" color="inherit">
          {contextStr}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
