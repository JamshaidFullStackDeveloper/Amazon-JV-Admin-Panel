import apiClient from '@/utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async thunk for API integration
export const fetchGetData = createAsyncThunk(
    'api/fetchGetData',
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
const getApiSlice = createSlice({
    name: 'getapi',
    initialState: {
        getdata: null,
        status: 'idle',
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        },
        resetData: (state) => {
            state.getdata = null;
            state.status = 'idle';
            state.error = null;
            state.successMessage = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchGetData.pending, (state) => {
                state.status = 'loading';
                state.getdata = null;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(fetchGetData.fulfilled, (state, action) => {
                state.status = 'succeeded';

                state.getdata = action.payload;
                state.successMessage = action.payload.successMessage;
            })
            .addCase(fetchGetData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { clearMessages, resetData } = getApiSlice.actions;

export default getApiSlice.reducer;
