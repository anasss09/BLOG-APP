import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchNews = createAsyncThunk('/news/all', async (data, thunkAPI) => {
    try {
        const res = await axios.get('/news/', data);
        return res.data.news;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const createNews = createAsyncThunk('/news/create', async (formData, thunkAPI) => {
    try {
        const res = await axios.post('/news/create', formData);
        return res.data.news;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const updateNews = createAsyncThunk('/news/update', async ({ id, formData }, thunkAPI) => {
    try {
        const res = await axios.patch(`/news/${id}`, formData);
        return res.data.news;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteNews = createAsyncThunk('/news/delete', async (id, thunkAPI) => {
    try {
        const res = await axios.delete(`/news/delete/${id}`);
        return res.data.deletedId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const incrementNewsViewCount = createAsyncThunk("/news/increment-view", async (id, thunkAPI) => {
    try {
        const res = await axios.post(`/news/view/${id}`);
        return { id, views: res.data.views };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

const newsSlice = createSlice({
    name: "news",
    initialState: {
        newsList: [],
        loading: false,
        creating: false,
        updating: false,
        deleting: false,
        error: null,
    },
    reducers: {
        resetNews: (state) => {
            state.newsList = [];
        }
    },
    extraReducers: (builder) => {
        builder
            /* ===== FETCH ===== */
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.loading = false;
                state.newsList = action.payload;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createNews.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createNews.fulfilled, (state, action) => {
                state.creating = false;
                if (action.payload) {
                    state.newsList.unshift(action.payload);
                }
            })
            .addCase(createNews.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            })

            /* ===== UPDATE ===== */
            .addCase(updateNews.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateNews.fulfilled, (state, action) => {
                state.updating = false;
                if (action.payload) {
                    const index = state.newsList.findIndex(
                        (news) => news._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.newsList[index] = action.payload;
                    }
                }
            })
            .addCase(updateNews.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })

            /* ===== DELETE ===== */
            .addCase(deleteNews.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteNews.fulfilled, (state, action) => {
                state.deleting = false;
                state.newsList = state.newsList.filter(
                    (news) => news._id !== action.payload
                );
            })
            .addCase(deleteNews.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            })

            /* ===== INCREMENT VIEW COUNT ===== */
            .addCase(incrementNewsViewCount.fulfilled, (state, action) => {
                const news = state.newsList.find((b) => b._id === action.payload.id);
                if (news) {
                    news.views = action.payload.views;
                }
            });
    }
});

export const { resetNews } = newsSlice.actions;
export default newsSlice.reducer;
