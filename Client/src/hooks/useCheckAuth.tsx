'use client'

import { setIsAuthenticated, setLoading, setUser } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useEffect } from "react";
import axios from "axios";

const useCheckAuth = () => {
    const dispatch = useAppDispatch();
    const { API_END_POINT1 } = useAppSelector((state) => state.user);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${API_END_POINT1}/user/check-auth`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                    dispatch(setIsAuthenticated(true));
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        }
        checkAuth();
    }, [])
}

export default useCheckAuth;