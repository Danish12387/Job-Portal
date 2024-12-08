"use client"

import useCheckAuth from "@/hooks/useCheckAuth"
import useGetAllPosts from "@/hooks/useGetAllPosts"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useState } from "react"
import PostComponent from "./Post"
import InfiniteScroll from "react-infinite-scroll-component"
import JobCardSkeleton from "./CardsSkeleton"
import { incrementPostPage } from "@/lib/features/post/postSlice"

export function PostFeed() {
    const { posts, page, hasMore, postLoading } = useAppSelector(state => state.posts);
    const dispatch = useAppDispatch();

    useGetAllPosts();
    useCheckAuth();

    const loadMoreJobs = () => {
        dispatch(incrementPostPage(page + 1));
    };

    return (
        <>
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMoreJobs}
                hasMore={hasMore}
                loader={Array(6).fill(0).map((_, index) => <JobCardSkeleton key={index} />)}
                endMessage={<p className='text-center text-gray-600 my-3'>You have reached the end</p>}>
                {
                    posts?.map((post) => {
                        return (
                            <PostComponent key={post?._id} post={post} />
                        )
                    })
                }
            </InfiniteScroll>
        </>
    )
}

