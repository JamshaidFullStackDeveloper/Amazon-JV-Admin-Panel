import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk for API integration
export const fetchData = createAsyncThunk(
    'api/fetchData',
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
const apiSlice = createSlice({
    name: 'api',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        },
        resetFetchedData: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
                state.data = null; // Reset existing data before fetching new data
                state.error = null;
                state.successMessage = null;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.successMessage = action.payload.successMessage;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { clearMessages, resetFetchedData } = apiSlice.actions;

export default apiSlice.reducer;
