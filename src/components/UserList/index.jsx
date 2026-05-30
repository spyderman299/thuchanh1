import React, { useState, useEffect } from "react"; // Thêm useState và useEffect
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData"; // Import "ống hút" dữ liệu

export default function UserList() {
  // Tạo kho chứa danh sách người dùng, ban đầu là mảng rỗng
  const [users, setUsers] = useState([]);

  // Dùng useEffect để gọi dữ liệu TỪ BACKEND ngay khi vừa mở trang
  useEffect(() => {
    // Nhớ thay link này bằng link Backend của ông nếu nó khác nhé
    fetchModel("https://qths3p-8081.csb.app/api/user/list")
      .then((data) => {
        setUsers(data); // Hút được dữ liệu thì đổ vào biến users
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách user:", error);
      });
  }, []);

  return (
    <List component="nav">
      {users.map((user) => {
        return (
          <React.Fragment key={user._id}>
            <ListItem
              button
              component={Link}
              to={`/users/${user._id}`}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
}
