// utils/userServiceClient.ts
import axios from 'axios';

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_BASE_URL; // Replace with actual User Service URL
export const fetchUserById = async (userId: number, headers: any) => {
    console.log("Headers at fetch user id: ", JSON.stringify(headers))
    try {
        const response = await axios.get(`http://auth-service:3001/api/v0/auth/users/${userId}`, {
            headers: {
                'Authorization': headers
            }
        });

        console.log("Response at fetch user by ID util: ", JSON.stringify(response));
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return null;
    }
};

