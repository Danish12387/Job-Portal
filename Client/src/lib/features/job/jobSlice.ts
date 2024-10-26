import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '@/utils/apiHandlers';

interface JobState {
    jobs: Job[];
    jobDetails: Job | null;
    totalJobs: number;
    page: number;
    hasMore: boolean,
    jobLoading: boolean,
}

const initialState: JobState = {
    jobs: [],
    jobDetails: null,
    totalJobs: 0,
    page: 1,
    hasMore: true,
    jobLoading: false,
};

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<Job[]>) => {
            state.jobs = action.payload;
        },
        setJobsCount: (state, action: PayloadAction<number>) => {
            state.totalJobs = action.payload;
        },
        setJobDetails: (state, action: PayloadAction<Job | null>) => {
            state.jobDetails = action.payload;
        },
        incrementPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
        setJobLoading: (state, action: PayloadAction<boolean>) => {
            state.jobLoading = action.payload;
        },
    },
});

export const { setJobs, setJobsCount, setJobDetails, incrementPage, setHasMore, setJobLoading } = jobSlice.actions;
export default jobSlice.reducer;
