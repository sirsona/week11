import { useCallback, useEffect, useState } from "react";
import { listLeads } from "../services/api";

export default function useFetch(initialParams = {}) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });
  const [params, setParams] = useState({
    limit: 10,
    offset: 0,
    q: "",
    status: "",
    ...initialParams,
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setLoading(true);
      const data = await listLeads(params);
      setLeads(data.data);
      setPagination({
        total: data.total,
        limit: data.limit,
        offset: data.offset,
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateParams = (newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, offset: 0 }));
  };

  const goToPage = (page) => {
    const offset = (page - 1) * params.limit;
    setParams((prev) => ({ ...prev, offset }));
  };

  const changeLimit = (limit) => {
    setParams((prev) => ({ ...prev, limit, offset: 0 }));
  };
  return {
    leads,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    changeLimit,
    refetch: fetchLeads,
  };
}
