import { useOrderStore } from "../../store/orderStore";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useNav = () => {
    const items = useOrderStore(state => state.items);
    const { signOutUser } = UserAuth()
    const navigate = useNavigate()

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            await signOutUser()
            navigate('/auth/signin')
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    return {
        handleLogout,
        items,
    }
}