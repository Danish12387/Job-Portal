import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '@/utils/apiHandlers';

interface JobState {
    jobs: Job[];
    count: number;
}

const initialState: JobState = {
    jobs: [],
    count: 0,
};

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<Job[]>) => {
            state.jobs = action.payload;
        },
        setJobsCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
    },
});

export const { setJobs, setJobsCount } = jobSlice.actions;
export default jobSlice.reducer;
