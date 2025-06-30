import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGetNotification = createAsyncThunk(
    'api/fetchGetNotification',
    async (endpoint, { rejectWithValue }) => {
        try {
            const response = await apiClient(endpoint);
            if (!response || !response.data) {
                throw new Error('No data received from API');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const getNotificationApiSlice = createSlice({
    name: 'getNotificationapi',
    initialState: {
        getNotificationdata: {
            data: [],           // Initialize as an empty array
            current_page: 0,    // For tracking pagination
            total_pages: 0,     // Optional: for "See more" logic
        },
        status: 'idle',
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetNotification.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(fetchGetNotification.fulfilled, (state, action) => {
                state.status = 'succeeded';

                // Append new data to existing memory
                const newData = action.payload.data || [];

                // state.getNotificationdata = {
                //     ...action.payload,
                //     data: [...state.getNotificationdata.data, ...newData], // merge old + new
                // };
                state.getNotificationdata = action.payload;

                state.successMessage = action.payload.successMessage;
            })
            .addCase(fetchGetNotification.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { clearMessages } = getNotificationApiSlice.actions;
export default getNotificationApiSlice.reducer;
