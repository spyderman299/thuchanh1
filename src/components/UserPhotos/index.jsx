import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { apiPost } from "../../lib/api";
import { API_BASE } from "../../lib/config";
import { useUser } from "../../contexts/UserContext";

export default function UserPhotos() {
  const { userId } = useParams();
  const { refreshKey } = useUser();
  const [photos, setPhotos] = useState(null);
  // Per-photo text being typed in the "add comment" boxes.
  const [drafts, setDrafts] = useState({});

  const loadPhotos = useCallback(() => {
    fetchModel(`/photosOfUser/${userId}`)
      .then((data) => setPhotos(data))
      .catch((error) => {
        console.error("Error loading photos:", error);
        setPhotos([]);
      });
  }, [userId]);

  // Reload when the user changes OR after an upload/comment (refreshKey).
  useEffect(() => {
    setPhotos(null);
    loadPhotos();
  }, [loadPhotos, refreshKey]);

  const formatTime = (dateString) => new Date(dateString).toLocaleString();

  const handleAddComment = async (photoId) => {
    const text = (drafts[photoId] || "").trim();
    if (!text) return;
    try {
      const updatedPhoto = await apiPost(`/commentsOfPhoto/${photoId}`, {
        comment: text,
      });
      // Replace just this photo in state so the new comment appears immediately.
      setPhotos((prev) =>
        prev.map((p) => (p._id === photoId ? updatedPhoto : p))
      );
      setDrafts((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!photos) {
    return <Typography style={{ padding: "20px" }}>Loading photos...</Typography>;
  }
  if (photos.length === 0) {
    return <Typography style={{ padding: "20px" }}>This user has no photos yet.</Typography>;
  }

  return (
    <div style={{ padding: "10px" }}>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: "30px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <CardMedia
            component="img"
            image={`${API_BASE}/images/${photo.file_name}`}
            alt="User photo"
            style={{ width: "100%", height: "auto" }}
          />
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              Posted: {formatTime(photo.date_time)}
            </Typography>
            <Divider style={{ margin: "15px 0" }} />

            <Typography variant="h6" gutterBottom>
              Comments:
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div
                  key={comment._id}
                  style={{
                    marginBottom: "15px",
                    backgroundColor: "#f9f9f9",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <Typography variant="body2">
                    {comment.user && (
                      <Link
                        to={`/users/${comment.user._id}`}
                        style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </Link>
                    )}
                    <span style={{ color: "gray", fontSize: "0.85em", marginLeft: "10px" }}>
                      ({formatTime(comment.date_time)})
                    </span>
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: "5px" }}>
                    {comment.comment}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments yet.
              </Typography>
            )}

            {/* Add-comment box for the logged-in user (Problem 2) */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add a comment..."
                value={drafts[photo._id] || ""}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [photo._id]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleAddComment(photo._id)}
              />
              <Button variant="contained" onClick={() => handleAddComment(photo._id)}>
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
