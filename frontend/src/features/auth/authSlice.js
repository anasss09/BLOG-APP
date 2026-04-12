import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const loginUser = createAsyncThunk('/auth/login', async (data, thunkAPI) => {
    try {
        const res = await axios.post('/auth/login', data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data || error.message)
    }
});

export const registerUser = createAsyncThunk('/auth/register', async (data, thunkAPI) => {
    try {
        const res = await axios.post('/auth/register', data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
})

export const checkAuth = createAsyncThunk('/auth/checkAuth', async (data, thunkAPI) => {
    try {
        const res = await axios.get('/auth/checkAuth', data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
});

export const logoutUser = createAsyncThunk('/auth/logout', async (data, thunkAPI) => {
    try {
        const res = await axios.get('/auth/logout', data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        authLoading: true,
        error: null
    },

    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (build) => {
        build

            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false,
                state.user = action.payload.user || action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true,
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user || action.payload;
                state.loading = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload.user || action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.authLoading = false;
                state.user = null;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;