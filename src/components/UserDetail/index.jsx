import React, { useState, useEffect } from "react";
import { Typography, Button, Paper, Divider } from "@mui/material"; // Thêm Divider ở đây
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

export default function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Nhớ check xem link backend này có giống link ông đang chạy không nhé!
    fetchModel(`https://qths3p-8081.csb.app/api/user/${userId}`)
      .then((data) => setUser(data))
      .catch((err) => console.error("Lỗi lấy chi tiết:", err));
  }, [userId]);

  if (!user)
    return (
      <Typography style={{ padding: "20px" }}>
        Đang kết nối tới máy chủ...
      </Typography>
    );

  return (
    <Paper style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h4">
        {user.first_name} {user.last_name}
      </Typography>
      <Divider style={{ margin: "15px 0" }} />
      <Typography variant="body1">
        <strong>Nơi ở:</strong> {user.location}
      </Typography>
      <Typography variant="body1">
        <strong>Nghề nghiệp:</strong> {user.occupation}
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        <strong>Giới thiệu:</strong> {user.description}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/photos/${user._id}`}
        style={{ marginTop: "20px" }}
      >
        Xem bộ sưu tập ảnh
      </Button>
    </Paper>
  );
}
