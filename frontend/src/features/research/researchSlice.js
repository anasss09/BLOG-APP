import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchResearch = createAsyncThunk('/research/all', async (data, thunkAPI) => {
    try {
        const res = await axios.get('/research/', data);
        return res.data.blogs;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
});

export const createResearch = createAsyncThunk('/research/create', async (formData, thunkAPI) => {
    try {
        const res = await axios.post('/research/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.blogs;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
});

export const updateResearch = createAsyncThunk('/research/update', async ({ id, formData }, thunkAPI) => {
    try {
        const res = await axios.patch(`/research/${id}`, formData);
        return res.data.blogs;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteResearch = createAsyncThunk('/research/delete', async (id, thunkAPI) => {
    try {
        const res = await axios.delete(`/research/delete/${id}`);
        return res.data.deletedId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchDashboardStats = createAsyncThunk("/research/stats", async (_, thunkAPI) => {
    try {
        const res = await axios.get("research/stats");
        return res.data.stats;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const incrementViewCount = createAsyncThunk("/research/increment-view", async (id, thunkAPI) => {
    try {
        const res = await axios.post(`/research/view/${id}`);
        return { id, views: res.data.views };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

const researchSlice = createSlice({
    name: "research",

    initialState: {
        blogs: [],
        loading: false,
        creating: false,
        updating: false,
        deleting: false,
        error: null,
        stats: {
            totalPosts: 0,
            totalUsers: 0,
            totalViews: 0
        }

    },

    reducers: {
        resetResearch: (state) => {
            state.blogs = [];
        }
    },

    extraReducers: (builder) => {
        builder
            /* ===== FETCH ===== */
            .addCase(fetchResearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResearch.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload; // Direct assignment
            })
            .addCase(fetchResearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createResearch.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createResearch.fulfilled, (state, action) => {
                state.creating = false;
                if (action.payload) {
                    // Add new blog to the beginning of the array
                    state.blogs.unshift(action.payload);
                }
            })
            .addCase(createResearch.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            })

            /* ===== UPDATE ===== */
            .addCase(updateResearch.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateResearch.fulfilled, (state, action) => {
                state.updating = false;
                if (action.payload) {
                    const index = state.blogs.findIndex(
                        (blog) => blog._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.blogs[index] = action.payload;
                    }
                }
            })
            .addCase(updateResearch.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })

            /* ===== DELETE ===== */
            .addCase(deleteResearch.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteResearch.fulfilled, (state, action) => {
                state.deleting = false;
                state.blogs = state.blogs.filter(
                    (blog) => blog._id !== action.payload
                );
            })
            .addCase(deleteResearch.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            })

            /* ===== STATS ===== */
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== INCREMENT VIEW COUNT ===== */
            .addCase(incrementViewCount.fulfilled, (state, action) => {
                const blog = state.blogs.find((b) => b._id === action.payload.id);
                if (blog) {
                    blog.views = action.payload.views;
                }
            })
            .addCase(incrementViewCount.rejected, (state, action) => {
                console.log("View count failed");
            })

    }
});


export const { resetResearch } = researchSlice.actions;
export default researchSlice.reducer;