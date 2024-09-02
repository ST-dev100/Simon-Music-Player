import axios from 'axios';

// Cloudinary API configuration
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dvjrqfsos/image/upload'; // For images
const CLOUDINARY_AUDIO_URL = 'https://api.cloudinary.com/v1_1/dvjrqfsos/video/upload'; // For audio

export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ers5nr9j'); // Specify your upload preset
  const response = await axios.post(CLOUDINARY_URL, formData);
  return response.data.secure_url; // Return the secure URL for the uploaded image
}

export const uploadAudioToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ers5nr9j'); // Specify your upload preset
  const response = await axios.post(CLOUDINARY_AUDIO_URL, formData);
  return response.data.secure_url; // Return the secure URL for the uploaded audio
}
