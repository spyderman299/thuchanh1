import React, { useState, useEffect } from "react";
import { Typography, Card, CardMedia, CardContent, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

const BACKEND = "https://ckfrc6-8081.csb.app"; // ĐỔI thành URL backend

function UserPhotos() {
  const [photos, setPhotos] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    fetchModel(`/photo/photosOfUser/${userId}`)
      .then((res) => setPhotos(res.data))
      .catch(console.error);
  }, [userId]);

  if (!photos.length) return <Typography style={{ padding: 20 }}>Chưa có ảnh.</Typography>;

  return (
    <div style={{ padding: 10 }}>
      {photos.map((p) => (
        <Card key={p._id} style={{ marginBottom: 20 }}>
          <CardMedia component="img"
            image={`${BACKEND}/images/${p.file_name}`}
            style={{ maxHeight: 400, objectFit: "contain" }} />
          <CardContent>
            <Typography variant="h6">Bình luận:</Typography>
            <Divider />
            {p.comments.length === 0 && (
              <Typography color="textSecondary">Chưa có bình luận.</Typography>
            )}
            {p.comments.map((c) => (
              <div key={c._id} style={{ marginTop: 10 }}>
                <Typography>
                  <b>{c.user?.first_name} {c.user?.last_name}:</b> {c.comment}
                </Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default UserPhotos;
