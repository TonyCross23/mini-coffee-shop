import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
    userRole: string | null;
    loading: boolean;
}

const PrivateRoute = ({ children, allowedRoles, userRole, loading }: ProtectedRouteProps) => {

    if (loading) return <p>Loading...</p>;

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/no-access" replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute