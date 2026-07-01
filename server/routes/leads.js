const express = require("express");
const router = express.Router();

const db = require("../db/database");

// GET /api/leads

router.get("/leads", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const offset = Number(req.query.offset) || 0;
  const q = req.query.q || "";
  const status = req.query.status;

  let query = "SELECT * FROM leads";
  let countQuery = "SELECT COUNT(*) AS total FROM leads";

  const whereClauses = [];
  const params = [];

  if (q) {
    whereClauses.push("(name LIKE ? OR email LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }

  if (status) {
    whereClauses.push("status = ?");
    params.push(status);
  }

  if (whereClauses.length > 0) {
    const where = " WHERE " + whereClauses.join(" AND ");
    query += where;
    countQuery += where;
  }

  const total = db.prepare(countQuery).get(...params).total;

  query += `
    ORDER BY created_at DESC
    LIMIT ?
    OFFSET ?
  `;

  const rows = db.prepare(query).all(...params, limit, offset);

  res.json({
    data: rows,
    total,
    limit,
    offset,
  });
});

// GET /api/leads/:id

router.get("/lead/:id", (req, res) => {
  const { id } = req.params;

  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);

  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const conversation = db
    .prepare("SELECT * FROM conversations WHERE lead_id = ?")
    .get(id);

  const messages = db
    .prepare("SELECT * FROM messages WHERE lead_id = ?")
    .all(id);

  res.json({
    lead,
    conversation,
    messages,
  });
});

// PATCH /api/leads/:id
router.patch("/lead/:id", (req, res) => {
  const { id } = req.params;
  const { status, notes, name, email } = req.body;
  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);

  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const fields = [];
  const params = [];

  if (status) {
    fields.push("status = ?");
    params.push(status);
  }
  if (notes) {
    fields.push("notes = ?");
    params.push(notes);
  }
  if (name) {
    fields.push("name = ?");
    params.push(name);
  }
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }
  fields.push("updated_at = datetime('now')");
  params.push(id);

  db.prepare(`UPDATE leads SET ${fields.join(", ")} WHERE id = ?`).run(
    ...params,
  );

  const updated = db
    .prepare("SELECT * FROM leads WHERE id = ?")
    .get(req.params.id);

  res.json(updated);
});

// GET /api/stats

router.get("/stats", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS n FROM leads").get().n;

  const byStatusRows = db
    .prepare(
      `
      SELECT
        status,
        COUNT(*) AS n
      FROM leads
      GROUP BY status
    `,
    )
    .all();

  const byStatus = {};

  for (const row of byStatusRows) {
    byStatus[row.status] = row.n;
  }

  res.json({
    total,
    byStatus: {
      new: byStatus.new || 0,
      contacted: byStatus.contacted || 0,
      qualified: byStatus.qualified || 0,
      closed: byStatus.closed || 0,
    },
  });
});

module.exports = router;
