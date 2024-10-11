import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/utils/apiHandlers';

interface UserState {
    API_END_POINT1: string;
    isAuthenticated: boolean
    loading: boolean
    user: User | null;
}

const initialState: UserState = {
    API_END_POINT1: "http://localhost:8000/api/v1",
    isAuthenticated: false,
    loading: true,
    user: null
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
    },
});

export const { setUser, setIsAuthenticated, setLoading } = userSlice.actions;
export default userSlice.reducer;
