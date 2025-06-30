import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for deleting data from the API
export const deleteData = createAsyncThunk(
    'api/deleteData',
    async ({ endpoint, id }, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`${endpoint}`);

            if (!response || !response.data) {
                throw new Error('No response from API');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const deleteSlice = createSlice({
    name: 'deleteApi',
    initialState: {
        deleteStatus: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
        deleteError: null,     // Stores error message if deletion fails
        deleteSuccessMessage: null, // Stores success message
    },
    reducers: {
        clearMessages: (state) => {
            state.deleteSuccessMessage = null;
            state.deleteError = null;
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteData.pending, (state) => {
                state.deleteStatus = 'loading';
                state.deleteError = null;
                state.deleteSuccessMessage = null;
            })
            .addCase(deleteData.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                state.deleteSuccessMessage = action.payload.message;
            })
            .addCase(deleteData.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload || 'Failed to delete data';
            });
    },
});

export const { clearMessages, resetDeleteStatus } = deleteSlice.actions;
export default deleteSlice.reducer;
