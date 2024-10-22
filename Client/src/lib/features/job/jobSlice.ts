import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '@/utils/apiHandlers';

interface JobState {
    jobs: Job[];
    jobDetails: Job | null;
    count: number;
}

const initialState: JobState = {
    jobs: [],
    jobDetails: null,
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
        setJobDetails: (state, action: PayloadAction<Job | null>) => {
            state.jobDetails = action.payload;
        },
    },
});

export const { setJobs, setJobsCount, setJobDetails } = jobSlice.actions;
export default jobSlice.reducer;
