import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for posting data via API
export const postData = createAsyncThunk(
    "postApi/postData",
    async ({ endpoint, payload }, { rejectWithValue }) => {
        try {
            console.log(payload);
            // return
            const response = await apiClient.post(endpoint, payload);
            if (!response || !response.data) {
                throw new Error("No response from API");
            }

            if (response.data.status === "error") {
                return rejectWithValue(response.data.message || "Something went wrong");
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const postSlice = createSlice({
    name: 'postApi',
    initialState: {
        postReceivedData: null,          // Stores API response data
        postStatus: 'idle',              // 'idle' | 'loading' | 'succeeded' | 'failed'
        postError: null,                 // Error message
        postSuccessMessage: null,       // Success message
    },
    reducers: {
        clearMessages: (state) => {
            state.postSuccessMessage = null;
            state.postError = null;
        },
        resetPostStatus: (state) => {
            state.postStatus = 'idle';
        },
        resetPostState: (state) => {
            state.postReceivedData = null;
            state.postStatus = 'idle';
            state.postSuccessMessage = null;
            state.postError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(postData.pending, (state) => {
                state.postStatus = 'loading';
                state.postError = null;
                state.postSuccessMessage = null;
            })
            .addCase(postData.fulfilled, (state, action) => {
                state.postStatus = 'succeeded';
                state.postReceivedData = action.payload.data;
                state.postSuccessMessage = action.payload.message || 'Data submitted successfully!';
            })
            .addCase(postData.rejected, (state, action) => {
                state.postStatus = 'failed';
                state.postError = action.payload || 'Something went wrong';
                console.log(action.payload);

            });
    },
});

export const { clearMessages, resetPostStatus, resetPostState } = postSlice.actions;
export default postSlice.reducer;
