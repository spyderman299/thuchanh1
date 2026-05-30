import React, { useState, useEffect } from "react";
import { Typography, Button, Paper, Divider } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

export default function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(null);
    fetchModel(`/user/${userId}`)
      .then((data) => setUser(data))
      .catch((err) => console.error("Error loading user detail:", err));
  }, [userId]);

  if (!user) {
    return <Typography style={{ padding: "20px" }}>Connecting to server...</Typography>;
  }

  return (
    <Paper style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h4">
        {user.first_name} {user.last_name}
      </Typography>
      <Divider style={{ margin: "15px 0" }} />
      <Typography variant="body1"><strong>Location:</strong> {user.location}</Typography>
      <Typography variant="body1"><strong>Occupation:</strong> {user.occupation}</Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        <strong>Description:</strong> {user.description}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/photos/${user._id}`}
        style={{ marginTop: "20px" }}
      >
        View photos
      </Button>
    </Paper>
  );
}
