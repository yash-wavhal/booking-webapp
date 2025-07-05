import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

function useFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  // Use environment variable or fallback
  const BASE_URL =
    process.env.API_BASE_URL;

  console.log("BASE_URL", BASE_URL);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<T>(BASE_URL + url);
        setData(res.data);
        setError(null);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get<T>(BASE_URL + url);
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reFetch };
}

export default useFetch;
