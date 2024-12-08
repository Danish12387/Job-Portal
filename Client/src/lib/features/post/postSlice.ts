import { Post } from "@/utils/apiHandlers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
    posts: Post[];
    page: number;
    hasMore: boolean;
    postLoading: boolean;
}

const initialState: PostState = {
    posts: [],
    page: 1,
    hasMore: true,
    postLoading: true,
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        },
        incrementPostPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setPostHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
        setPostLoading: (state, action: PayloadAction<boolean>) => {
            state.postLoading = action.payload;
        },
    },
});

export const { setPosts, incrementPostPage, setPostHasMore, setPostLoading } = postSlice.actions;
export default postSlice.reducer;