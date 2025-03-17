import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk for API integration
export const fetchData = createAsyncThunk(
    'api/fetchData',
    async (endpoint, { rejectWithValue }) => {
        try {
            const response = await apiClient(endpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            return data;
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
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

export const { clearMessages } = apiSlice.actions;

export default apiSlice.reducer;
