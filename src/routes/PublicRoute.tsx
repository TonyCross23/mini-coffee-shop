import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: React.ReactNode;
    userRole: string | null;
    loading: boolean;
}

const PublicRoute = ({ children, userRole, loading }: PublicRouteProps) => {
    
    if (loading) return <p>Loading...</p>;

    if (userRole) {
        if (userRole === "admin") {
            return <Navigate to="/admin/noallow" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default PublicRoute;