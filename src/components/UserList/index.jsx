import React, { useState, useEffect } from "react";
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchModel("/user/list")
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error loading user list:", error));
  }, []);

  return (
    <List component="nav">
      {users.map((user) => (
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
      ))}
    </List>
  );
}
