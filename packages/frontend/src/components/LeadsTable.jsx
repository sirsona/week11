import { useNavigate } from "react-router";

export default function LeadsTable({ leads }) {
  const navigate = useNavigate();
  if (leads.length === 0) {
    return (
      <div> No leads yet. Message your WhatsApp number to create one.</div>
    );
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Inquiry</th>
            <th>Status</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} onClick={() => navigate(`/lead/${lead.id}`)}>
              <td>{lead.name}</td>
              <td>{lead.wa_phone}</td>
              <td>{lead.email}</td>
              <td>{lead.inquiry_type}</td>
              <td>{lead.status}</td>
              <td>{lead.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
