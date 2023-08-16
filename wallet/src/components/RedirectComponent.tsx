import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectComponent = ({ path }: { path: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to path when the component mounts
    navigate(path, { replace: true });
  }, [navigate, path]);

  return null; // This component doesn't render anything, as it redirects immediately
};

export default RedirectComponent;
