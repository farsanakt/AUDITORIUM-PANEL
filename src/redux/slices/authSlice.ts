import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: string;
  role: 'admin' | 'user' | 'auditorium';
  email: string;
}

interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  loading: boolean;
  error: boolean;
  isAuthenticated: boolean | null;
}

const initialState: AuthState = {
  currentUser: null,
  accessToken: null,
  loading: false,
  error: false,
  isAuthenticated: null,
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

      localStorage.setItem('accessToken', action.payload.accessToken);
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

      localStorage.removeItem('accessToken');
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
