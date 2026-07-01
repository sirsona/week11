import LeadsTable from "../components/LeadsTable";
import useFetch from "../hooks/useFetch";

export default function Dashboard() {
  const { leads, loading, error, params, pagination, updateParams, goToPage } =
    useFetch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  return (
    <>
      <input
        autoFocus
        type="text"
        placeholder="Search..."
        value={params.q}
        onChange={(e) => {
          console.log(e.target.value);
          updateParams({ q: e.target.value });
        }}
      />

      <select
        value={params.status}
        onChange={(e) => updateParams({ status: e.target.value })}
      >
        <option value="">All</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="closed">Closed</option>
      </select>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      <LeadsTable leads={leads} />

      <button
        disabled={pagination.offset === 0}
        onClick={() => goToPage(currentPage - 1)}
      >
        Previous
      </button>

      <button
        disabled={pagination.offset + pagination.limit >= pagination.total}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    </>
  );
}
