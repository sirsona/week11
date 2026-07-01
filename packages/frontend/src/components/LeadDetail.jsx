import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getLead } from "../services/api";

export default function LeadDetail() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function loadLead() {
      const data = await getLead(id);
      console.log(data.messages);

      setLead(data.lead);
      setMessages(data.messages);
    }

    loadLead();
  }, [id]);

  if (lead === null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>{lead.name}</h2>

      <p>
        <strong>Phone:</strong> {lead.wa_phone}
      </p>

      <p>
        <strong>Email:</strong> {lead.email}
      </p>

      <p>
        <strong>Inquiry:</strong> {lead.inquiry_type}
      </p>

      <p>
        <strong>Status:</strong> {lead.status}
      </p>

      <h3>Conversation</h3>

      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.direction}</strong>

          <p>{message.body}</p>
        </div>
      ))}
    </>
  );
}
