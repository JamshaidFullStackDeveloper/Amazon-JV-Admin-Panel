import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './GetApiSlice/Index.jsx';
import putSliceReducer from './PutApiSlice/Index.jsx';
import postSliceReducer from './PostApiSlice/Index.jsx';
import deleteSliceReducer from './DeleteApiSlice/index.jsx';
import getApiSliceReducer from './GetApiSlice/GetSlice.jsx';
import getNotificationApiSliceReducer from './GetApiSlice/GetNotfication.jsx';
import apiDashboardSliceReducer from './GetApiSlice/GetDashboard.jsx';
// import vehicleDetailsSliceReducer from './DispatchJobSlices/GetVhicles.jsx';
// import serviceTypeSliceReducer from './DispatchJobSlices/GetServiceType.jsx';
// import settingsSliceReducer from './DispatchJobSlices/GetSettings.jsx';
// import postJobSliceReducer from "./DispatchJobSlices/PostJob.jsx";
export const store = configureStore({
  reducer: {
    api: apiReducer,
    putApi: putSliceReducer,
    postApi: postSliceReducer,
    deleteApi: deleteSliceReducer,
    getapi: getApiSliceReducer,
    getNotificationapi: getNotificationApiSliceReducer,
    dashboardApi: apiDashboardSliceReducer,
    // vehicle: vehicleDetailsSliceReducer,

  },
});
