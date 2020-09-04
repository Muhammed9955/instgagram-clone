import React, { useState } from "react";
import { Button } from "@material-ui/core/";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ userName }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    const uplaodTask = storage.ref(`images/${image.name}`).put(image);
    uplaodTask.on(
      "state_changed",
      (snapshot) => {
        // progress func...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        //   compelete func...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: userName,
            });
          });
        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };
  return (
    <div className="imageUplaod">
      <progress
        className="imageUplaod__progress p "
        value={progress}
        max="100"
      />

      <input
        type="text"
        placeholder="Enter a caption or description "
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
        className="p"
      />
      <input type="file" onChange={handleChange} className="p" />
      {image && <Button onClick={handleUpload}>UPLOAD</Button>}
    </div>
  );
}

export default ImageUpload;
