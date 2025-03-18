import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import "./XrayCheck.css";

const ModernXrayUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(
    JSON.parse(sessionStorage.getItem("userInfo")).token
  );

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUploadProgress(0);
      setUploadStatus("");
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    const uploadImage = async () => {
      const formData = new FormData();
      formData.append("XrayImage", selectedImage);

      try {
        const response = await fetch("http://bonex.runasp.net/Xray/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const responseBody = await response.json();

        if (response.ok) {
          setUploadProgress(100);
          setUploadStatus(
            `Analysis: ${responseBody.aiAnalysisResult || "No detailed result"}`
          );
          console.log(responseBody);
        } else {
          setUploadStatus(
            `Upload failed: ${responseBody.message || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("Upload failed");
      } finally {
        setIsLoading(false);
      }
    };

    uploadImage();

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage, token]);

  return (
    <div className="modern-upload-container">
      <motion.div
        className="upload-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          id="file-upload"
          className="file-input"
        />
        <label htmlFor="file-upload" className="upload-label">
          <FaCloudUploadAlt className="upload-icon" />
          <span>Upload X-Ray Image</span>
        </label>

        {previewUrl && (
          <div className="preview-section">
            <div className="image-preview">
              <img src={previewUrl} alt="X-Ray Preview" />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-indicator">
            <FaSpinner className="spinner-icon" />
            <span>Uploading and analyzing...</span>
          </div>
        )}

        {uploadStatus && (
          <div
            className={`status-indicator ${
              uploadStatus.includes("failed") ? "error" : "success"
            }`}
          >
            {uploadStatus.includes("failed") ? (
              <FaTimesCircle />
            ) : (
              <FaCheckCircle />
            )}
            <span>{uploadStatus}</span>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ModernXrayUpload;
