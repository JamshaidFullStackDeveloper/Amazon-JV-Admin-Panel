import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for updating data via API
export const putData = createAsyncThunk(
    'api/putData',
    async ({ endpoint, payload }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(endpoint, payload);

            if (!response || !response.data) {
                throw new Error('No response from API');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const putSlice = createSlice({
    name: 'putApi',
    initialState: {
        putData: null,         // Stores response data
        putStatus: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
        putError: null,        // Error message
        putSuccessMessage: null, // Success message from API
    },
    reducers: {
        clearMessages: (state) => {
            state.putSuccessMessage = null;
            state.putError = null;
        },
        resetPutStatus: (state) => {
            state.putStatus = 'idle';
            state.putSuccessMessage = null;
            state.putError = null;

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(putData.pending, (state) => {
                state.putStatus = 'loading';
                state.putError = null;
                state.putSuccessMessage = null;
            })
            .addCase(putData.fulfilled, (state, action) => {
                state.putStatus = 'succeeded';
                state.putData = action.payload;
                state.putSuccessMessage = action.payload.message || 'Update successful!';
            })
            .addCase(putData.rejected, (state, action) => {
                state.putStatus = 'failed';

                state.putError = action.payload || 'Something went wrong';
            });
    },
});

export const { clearMessages, resetPutStatus } = putSlice.actions;
export default putSlice.reducer;
