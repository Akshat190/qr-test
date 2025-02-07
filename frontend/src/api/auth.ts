import axios from 'axios';

const API_URL = 'https://qr-test-puxi.onrender.com/api';

export const signup = async (
  email: string, 
  password: string, 
  role: string,
  restaurantName?: string
) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      role,
      restaurantName
    });
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Get the specific error message from the backend
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw error;
  }
};

export const signin = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export async function login(email: string, password: string) {
  try {
    const response = await fetch('https://qr-test-puxi.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
