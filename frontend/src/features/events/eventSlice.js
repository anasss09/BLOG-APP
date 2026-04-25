import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const fetchEvents = createAsyncThunk('/events/all', async (data, thunkAPI) => {
    try {
        const res = await axios.get('/events/', data);
        return res.data.events;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const createEvent = createAsyncThunk('/events/create', async (formData, thunkAPI) => {
    try {
        const res = await axios.post('/events/create', formData);
        return res.data.event;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const updateEvent = createAsyncThunk('/events/update', async ({ id, formData }, thunkAPI) => {
    try {
        const res = await axios.patch(`/events/${id}`, formData);
        return res.data.event;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteEvent = createAsyncThunk('/events/delete', async (id, thunkAPI) => {
    try {
        const res = await axios.delete(`/events/delete/${id}`);
        return res.data.deletedId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const incrementEventViewCount = createAsyncThunk("/events/increment-view", async (id, thunkAPI) => {
    try {
        const res = await axios.post(`/events/view/${id}`);
        return { id, views: res.data.views };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

const eventSlice = createSlice({
    name: "events",
    initialState: {
        events: [],
        loading: false,
        creating: false,
        updating: false,
        deleting: false,
        error: null,
    },
    reducers: {
        resetEvents: (state) => {
            state.events = [];
        }
    },
    extraReducers: (builder) => {
        builder
            /* ===== FETCH ===== */
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ===== CREATE ===== */
            .addCase(createEvent.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.creating = false;
                if (action.payload) {
                    state.events.unshift(action.payload);
                }
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            })

            /* ===== UPDATE ===== */
            .addCase(updateEvent.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.updating = false;
                if (action.payload) {
                    const index = state.events.findIndex(
                        (event) => event._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.events[index] = action.payload;
                    }
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            })

            /* ===== DELETE ===== */
            .addCase(deleteEvent.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.deleting = false;
                state.events = state.events.filter(
                    (event) => event._id !== action.payload
                );
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            })

            /* ===== INCREMENT VIEW COUNT ===== */
            .addCase(incrementEventViewCount.fulfilled, (state, action) => {
                const event = state.events.find((b) => b._id === action.payload.id);
                if (event) {
                    event.views = action.payload.views;
                }
            });
    }
});

export const { resetEvents } = eventSlice.actions;
export default eventSlice.reducer;
