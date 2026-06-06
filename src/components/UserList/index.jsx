import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchModel("/user/list")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <List>
      {users.map((u) => (
        <React.Fragment key={u._id}>
          <ListItem button component={Link} to={`/users/${u._id}`}>
            <ListItemText primary={`${u.first_name} ${u.last_name}`} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}
export default UserList;
