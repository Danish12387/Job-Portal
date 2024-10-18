'use client'

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react"
import axios from "axios";
import { setJobs, setJobsCount } from "@/lib/features/job/jobSlice";

const useGetAllJobs = () => {
    const dispatch = useAppDispatch();
    const { API_END_POINT1 } = useAppSelector((state) => state.user);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${API_END_POINT1}/job/fetch-jobs`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setJobs(res.data.jobs));
                    dispatch(setJobsCount(res.data.count));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchJobs();
    }, [])
}

export default useGetAllJobs;