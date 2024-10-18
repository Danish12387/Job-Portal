import { configureStore } from '@reduxjs/toolkit'
import userSlice from './features/user/userSlice';
import jobSlice from './features/job/jobSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userSlice,
            jobs: jobSlice,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']