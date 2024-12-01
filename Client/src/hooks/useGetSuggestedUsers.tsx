import { setSuggestedUsers } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { useEffect } from "react";

const GetSuggestedUsers = () => {
    const dispatch = useAppDispatch();
    const { API_END_POINT1 } = useAppSelector((state) => state.user);

    useEffect(() => {
        const fetchedSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${API_END_POINT1}/user/get-suggested-users`);
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.suggestedUsers));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchedSuggestedUsers();
    }, []);
}

export default GetSuggestedUsers;