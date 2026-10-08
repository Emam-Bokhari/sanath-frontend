import { useMemo } from "react";

const useBaseUrl = () => {
  const baseUrl = useMemo(() => {
    // Use environment variable or fallback to default
    return process.env.NEXT_PUBLIC_API_URL;
  }, []);

  return baseUrl;
};

export default useBaseUrl;
