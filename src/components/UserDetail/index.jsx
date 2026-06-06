import React, { useState, useEffect } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, [userId]);

  if (!user) return <Typography>Đang tải...</Typography>;
  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">{user.first_name} {user.last_name}</Typography>
      <Divider style={{ margin: "15px 0" }} />
      <Typography>Nơi ở: {user.location}</Typography>
      <Typography>Nghề nghiệp: {user.occupation}</Typography>
      <Typography>Mô tả: {user.description}</Typography>
      <Button variant="contained" component={Link}
        to={`/photos/${userId}`} style={{ marginTop: 20 }}>
        Xem ảnh
      </Button>
    </div>
  );
}
export default UserDetail;
