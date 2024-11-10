'use client'

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react"
import axios from "axios";
import { setHasMore, setHomeJobs, setJobLoading, setJobs, setJobsCount } from "@/lib/features/job/jobSlice";
import { Job } from "@/utils/apiHandlers";

const useGetAllJobs = () => {
    const dispatch = useAppDispatch();
    const { API_END_POINT1 } = useAppSelector((state) => state.user);
    const { page, jobs, hasMore, jobFiltersState } = useAppSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(setJobLoading(true));

        const shuffleArray = (array: Job[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${API_END_POINT1}/job/fetch-jobs?page=${page}&filters=${JSON.stringify(jobFiltersState)}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setTimeout(() => {
                        if (page === 1) {
                            dispatch(setJobs(res.data.jobs));
                            const homejobs = res.data.jobs.slice(0, 6);
                            dispatch(setHomeJobs(homejobs));
                        } else {
                            // const shuffledItems = shuffleArray([...res.data.jobs]);
                            dispatch(setJobs([...jobs, ...res.data.jobs]));
                        }
                        dispatch(setJobsCount(res.data.totalJobs));

                        // if (res.data.totalPages <= res.data.currentPage) {
                        dispatch(setHasMore(false));
                        // }
                    }, 100);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setTimeout(() => {
                    dispatch(setJobLoading(false));
                }, 2000);
            }
        }
        fetchJobs();
        // if (hasMore) {
        // } else {
        //     dispatch(setJobLoading(false));
        // }
    }, [page, hasMore, jobFiltersState])
}

export default useGetAllJobs;