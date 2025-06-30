import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk for API integration
export const fetchDashboardData = createAsyncThunk(
    'api/fetchDashboardData',
    async (endpoint, { rejectWithValue }) => {
        try {
            const response = await apiClient(endpoint);

            if (!response || !response.data) {
                throw new Error('No data received from API');
            }
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
const apiDashboardSlice = createSlice({
    name: 'dashboardApi',
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.status = 'loading';
                state.data = null; // Reset existing data before fetching new data
                state.error = null;
                state.successMessage = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.successMessage = action.payload.successMessage;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { clearMessages } = apiDashboardSlice.actions;

export default apiDashboardSlice.reducer;
