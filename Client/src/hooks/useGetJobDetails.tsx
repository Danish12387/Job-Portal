'use client'

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react"
import axios from "axios";
import { setJobDetails } from "@/lib/features/job/jobSlice";

const useGetJobDetails = (slug: string) => {
    const dispatch = useAppDispatch();
    const { API_END_POINT1 } = useAppSelector((state) => state.user);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await axios.get(`${API_END_POINT1}/job/${slug}/details`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setJobDetails(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchJobDetails();
    }, [])
}

export default useGetJobDetails;