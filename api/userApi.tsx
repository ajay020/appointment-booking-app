import api from "@/lib/apiClient";

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt?: string;
    updatedAt?: string;
}

export const getUserProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateUserProfile = async (data: { name: string; email: string }): Promise<User> => {
    const response = await api.put<User>('/users/me', data);
    return response.data;
};
// export const deleteUserProfile = async (): Promise<void> => {
//     await api.delete('/users/me');
// };