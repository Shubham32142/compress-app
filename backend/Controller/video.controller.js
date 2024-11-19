import fs from "fs";
import { videos } from "../Model/Video_model.js";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import ffmpeg from "fluent-ffmpeg";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export async function uploadVideo(req, res) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { originalname, size } = file;
  const filePath = file.path;

  try {
    const originalUploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `original/${originalname}`,
      Body: fs.createReadStream(filePath),
    };
    const originalUpload = await s3.upload(originalUploadParams).promise();

    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .output(compressedPath)
        .size("70%")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });
    const compressedUploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `compressed/compressed-${originalname}`,
      Body: fs.createReadStream(compressedPath),
    };
    const compressedUpload = await s3.upload(compressedUploadParams).promise();

    const videoData = new videos({
      fileName: originalname,
      originalSize: size,
      compressedSize: fs.statSync(compressedPath).size,
      compressionStatus: "Completed",
      downloadLinks: {
        original: originalUpload.Location,
        compressed: compressedUpload.Location,
      },
    });

    await videoData.save();

    fs.unlinkSync(filePath);
    fs.unlinkSync(compressedPath);

    res.status(200).json(videoData);
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);

    res.status(500).json({ message: "Upload or compression failed", error });
  }
}

export async function download(req, res) {
  try {
    const video = await videos.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.status(200).json({
      original: video.downloadLinks.original,
      compressed: video.downloadLinks.compressed,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving video", error });
  }
}

export async function videoById(req, res) {
  try {
    const video = await videos.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving video", error });
  }
}
