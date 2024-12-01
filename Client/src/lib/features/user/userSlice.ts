import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/utils/apiHandlers';

interface UserState {
    API_END_POINT1: string;
    isAuthenticated: boolean;
    loading: boolean;
    progress: number;
    user: User | null;
    suggestedUsers: User[];
}

const initialState: UserState = {
    API_END_POINT1: "http://localhost:8000/api/v1",
    isAuthenticated: false,
    loading: true,
    progress: 0,
    user: null,
    suggestedUsers: []
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setProgress: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
        },
        setSuggestedUsers: (state, action: PayloadAction<User[]>) => {
            state.suggestedUsers = action.payload;
        },
    },
});

export const { setUser, setIsAuthenticated, setLoading, setProgress, setSuggestedUsers } = userSlice.actions;
export default userSlice.reducer;
