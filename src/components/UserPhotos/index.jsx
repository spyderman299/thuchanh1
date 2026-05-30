import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

export default function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    // Gọi API lấy ảnh từ Backend
    fetchModel(`https://qths3p-8081.csb.app/api/photo/photosOfUser/${userId}`)
      .then((data) => {
        setPhotos(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy ảnh:", error);
        setPhotos([]);
      });
  }, [userId]);

  if (!photos)
    return (
      <Typography style={{ padding: "20px" }}>
        Đang tải bộ sưu tập ảnh...
      </Typography>
    );

  if (photos.length === 0)
    return (
      <Typography style={{ padding: "20px" }}>
        Người dùng này chưa có ảnh nào.
      </Typography>
    );

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div style={{ padding: "10px" }}>
      {photos.map((photo) => (
        <Card
          key={photo._id}
          style={{
            marginBottom: "30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <CardMedia
            component="img"
            // BỎ CÁI LINK BACKEND ĐI, chỉ để lại đường dẫn tương đối này thôi:
            image={`/images/${photo.file_name}`}
            alt="User photo"
            style={{ width: "100%", height: "auto" }}
          />
          <CardContent>
            <Typography variant="caption" color="textSecondary">
              Đăng lúc: {formatTime(photo.date_time)}
            </Typography>
            <Divider style={{ margin: "15px 0" }} />

            <Typography variant="h6" gutterBottom>
              Bình luận:
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
                    {comment.user_id && (
                      <Link
                        to={`/users/${comment.user_id._id}`}
                        style={{
                          textDecoration: "none",
                          color: "#1976d2",
                          fontWeight: "bold",
                        }}
                      >
                        {comment.user_id.first_name} {comment.user_id.last_name}
                      </Link>
                    )}
                    <span
                      style={{
                        color: "gray",
                        fontSize: "0.85em",
                        marginLeft: "10px",
                      }}
                    >
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
                Chưa có bình luận nào.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
