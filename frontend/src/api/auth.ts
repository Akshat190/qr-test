import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
  console.log('Attempting login for:', email);
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('Login successful, returning user data and token');
    localStorage.setItem('token', data.token);
    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
