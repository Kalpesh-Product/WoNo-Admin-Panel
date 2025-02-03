const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();
const { PassThrough } = require("stream"); // Correctly import PassThrough from the stream module

cloudinary.config({
  cloud_name: process.env.CLOUINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleFileUpload = async (file, path) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      timeout: 65000,
      transformation: [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      folder: path,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const handleFileDelete = async (public_id) => {
  try {
    const res = await cloudinary.uploader.destroy(public_id);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

// Function to upload PDF files
// const handlePdfUpload = async (file, path) => {
//   try {
//     const res = await cloudinary.uploader.upload(file, {
//       resource_type: "raw", // Specify "raw" for non-image files
//       timeout: 65000,
//       folder: path,
//     });
//     return res;
//   } catch (error) {
//     console.error("Error uploading PDF:", error);
//     throw new Error(error.message);
//   }
// };

const handlePdfUpload = async (buffer, path) => {
  try {
    // Create a new promise to handle the upload stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Specify "raw" for non-image files
          timeout: 65000,
          folder: path,
          format: "pdf", // Ensure the file is treated as a PDF
          type: "upload",
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading PDF:", error);
            reject(error); // Reject the promise on error
          } else {
            resolve(result); // Resolve the promise with the result
          }
        }
      );

      // Create a readable stream from the buffer
      const bufferStream = new PassThrough();
      bufferStream.end(buffer); // Pass the PDF buffer into the stream
      bufferStream.pipe(uploadStream); // Pipe the buffer stream into Cloudinary's upload stream
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new Error(error.message);
  }
};

// Function to delete PDF files
const handlePdfDelete = async (public_id) => {
  try {
    const res = await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw", // Specify "raw" for non-image files
    });
    return res;
  } catch (error) {
    console.error("Error deleting PDF:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  handleFileUpload,
  handleFileDelete,
  handlePdfUpload,
  handlePdfDelete,
};
