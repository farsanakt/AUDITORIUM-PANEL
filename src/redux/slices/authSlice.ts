import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: string;
  role: 'admin' | 'user' | 'auditorium'|'Staff';
  email: string;
  staffId:string
}

interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  loading: boolean;
  error: boolean;
  isAuthenticated: boolean | null;
}

// Get data from localStorage
const storedUser = localStorage.getItem('currentUser');
const storedToken = localStorage.getItem('accessToken');

const initialState: AuthState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken || null,
  loading: false,
  error: false,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = false;

      // Store in localStorage
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshToken,
} = authSlice.actions;

export default authSlice.reducer;
