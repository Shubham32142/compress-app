import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VideoDownload = () => {
  const { id } = useParams(); // Extracting ID from URL
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/video/${id}`);
        setVideo(response.data);
      } catch (err) {
        setError("Failed to fetch video. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="video-download">
      <h2>Download Video</h2>
      {video && (
        <>
          <p>
            <strong>Video Name:</strong> {video.fileName}
          </p>
          <p>
            <strong>Original Size:</strong>{" "}
            {Math.round(video.originalSize / 1024 / 1024)} MB
          </p>
          <p>
            <strong>Compressed Size:</strong>{" "}
            {Math.round(video.compressedSize / 1024 / 1024)} MB
          </p>
          <div>
            <button
              onClick={() =>
                window.open(video.downloadLinks.original, "_blank")
              }
            >
              Download Original
            </button>
            <button
              onClick={() =>
                window.open(video.downloadLinks.compressed, "_blank")
              }
            >
              Download Compressed
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoDownload;
