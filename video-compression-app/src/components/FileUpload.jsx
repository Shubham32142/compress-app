import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import "./FileUpload.css";
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Clear previous messages
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploading(true);
      setMessage(""); // Clear previous messages
      const response = await axios.post(
        "https://compress-backend2.onrender.com/videos/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const videoId = response.data._id; // Extracting the  ID from the response
      setMessage("Video uploaded successfully!");
      setUploading(false);

      // Redirect to the download page with the ID
      navigate(`/download/${videoId}`);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      setUploading(false);
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="file-upload">
        <h2>Upload Video</h2>
        <label htmlFor="file-upload" className="custom-file-upload">
          Choose file
        </label>
        <input
          type="file"
          accept="video/*"
          id="file-upload"
          onChange={handleFileChange}
          className="upload-input"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-btn"
        >
          {uploading ? <Loader /> : "Upload"}
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
