// utils/userServiceClient.ts
import axios from 'axios';

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_BASE_URL; // Replace with actual User Service URL

export const fetchUserById = async (userId: number) => {
    try {
        const response = await axios.get(`${USER_SERVICE_BASE_URL}/users/${userId}`);
        return response.data; // Assuming the user data is directly in the response
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return null;
    }
};
