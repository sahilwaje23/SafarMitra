
// ignore this one folder
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const FileUpload = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleUpload = () => {
    if (!fileName) {
      alert("Please select a file before uploading.");
      return;
    }
    alert(`File "${fileName}" uploaded successfully!`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: 3,
        maxWidth: 400,
        margin: "auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Upload a File
      </Typography>

      {/* File Input (hidden) */}
      <input
        accept="*"
        type="file"
        id="file-input"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* TextField to Display File Name */}
      <TextField
        label="Selected File"
        value={fileName}
        variant="outlined"
        fullWidth
        disabled
        sx={{
          "& .MuiInputBase-input": {
            color: "#333",
          },
        }}
      />

      {/* Upload Button */}
      <label htmlFor="file-input">
        <Button variant="contained" color="primary" component="span">
          Choose File
        </Button>
      </label>

      {/* Submit/Upload Button */}
      <Button
        variant="contained"
        color="success"
        onClick={handleUpload}
        disabled={!fileName}
      >
        Upload
      </Button>
    </Box>
  );
};

export default FileUpload;
