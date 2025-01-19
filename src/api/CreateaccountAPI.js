import axios from 'axios';

const BASE_URL = 'https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire';

export const createUser = async (userData) => {
  try {
    const response = await axios.post(BASE_URL, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user. Please try again later.');
  }
};