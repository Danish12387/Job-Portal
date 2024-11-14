import { useEffect } from "react";
import { setHomeJobs } from "@/lib/features/job/jobSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";

const useGetHomeJobs = () => {
    const dispatch = useAppDispatch();
    const { API_END_POINT1 } = useAppSelector((state) => state.user);

    useEffect(() => {
        const fetchHomeJobs = async () => {
            try {
                const res = await axios.get(`${API_END_POINT1}/job/homeJobs`);
                if (res.data.success) {
                    dispatch(setHomeJobs(res.data.homeJobs));
                }
            } catch (error: any) {
                console.log(error)
            }
        }
        fetchHomeJobs();
    }, [])
}


export default useGetHomeJobs;