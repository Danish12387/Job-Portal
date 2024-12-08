import { setPostHasMore, setPostLoading, setPosts } from "@/lib/features/post/postSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { useEffect } from "react";

const useGetAllPosts = () => {
    const { API_END_POINT1 } = useAppSelector(state => state.user);
    const { page, posts, hasMore } = useAppSelector(state => state.posts);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setPostLoading(true));
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get(`${API_END_POINT1}/post/get-all-posts?page=${page}`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    dispatch(setPosts([...posts, ...res.data.posts]));
                    setPostLoading(false);
                }

                if (res.data.totalPages <= res.data.currentPage) {
                    dispatch(setPostHasMore(false));
                }

            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setPostLoading(false));
            }
        }
        fetchAllPosts();
    }, [page, hasMore]);
}

export default useGetAllPosts;