import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '@/utils/apiHandlers';

export interface JobFilters {
    location: string;
    time: string;
    selectedJobTypes: string[];
    workExperience: string;
    salary: string;
    selectValue: string;
    searchInputs: {
        location: string;
        search: string;
    };
}

interface JobState {
    jobs: Job[];
    userJobsState: Job[];
    homeJobs: Job[];
    jobFiltersState: JobFilters | null;
    jobDetails: Job | null;
    totalJobs: number;
    page: number;
    hasMore: boolean;
    jobLoading: boolean;
}

const initialState: JobState = {
    jobs: [],
    userJobsState: [],
    homeJobs: [],
    jobFiltersState: null,
    jobDetails: null,
    totalJobs: 0,
    page: 1,
    hasMore: true,
    jobLoading: true,
};

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<Job[]>) => {
            state.jobs = action.payload;
        },
        setUserJobsState: (state, action: PayloadAction<Job[]>) => {
            state.userJobsState = action.payload;
        },
        setHomeJobs: (state, action: PayloadAction<Job[]>) => {
            state.homeJobs = action.payload;
        },
        setJobFiltersState: (state, action: PayloadAction<JobFilters>) => {
            state.jobFiltersState = action.payload;
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

export const { setJobs, setUserJobsState, setHomeJobs, setJobFiltersState, setJobsCount, setJobDetails, incrementPage, setHasMore, setJobLoading } = jobSlice.actions;
export default jobSlice.reducer;
