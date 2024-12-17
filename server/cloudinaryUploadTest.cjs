const cloudinary = require('cloudinary').v2;

// Configure your Cloudinary account
cloudinary.config({
  cloud_name: 'dfbykovxk',
  api_key: '371911366176772',
  api_secret: 'KAXRrJitN0aHw7vGHZMxDNWDFFY'
});

// Function to upload an image to Cloudinary
function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// Test the upload function
const testFilePath = '/home/hdd/Documents/QAirlineX/QAirlines/server/uploads/EasyReading_NoGrid.png';
uploadImage(testFilePath)
  .then(result => {
    console.log('Upload successful:', result);
  })
  .catch(error => {
    console.error('Upload failed:', error);
  });

// To run this script, use the following command in your terminal:
// node cloudinaryUploadTest.js