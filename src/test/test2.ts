import express, { Request, Response } from "express";

const app = express();

// ===== BAD CODE =====

// Wrong status codes
app.get("/resource1", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ error: "Authentication required" }) // Should be 401
  }

  if (!hasPermission(req.user, "read_resource")) {
    return res.status(401).json({ error: "Permission denied" }) // Should be 403
  }

  res.status(200).json({ data: "ok" });
});

// Using 500 for client error
app.post("/resource2", (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(500).json({ error: "Name is required" }) // Should be 400
  }
  res.status(201).json({ message: "Created" });
});

// ===== GOOD CODE =====

app.get("/resource3", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" })
  }

  if (!hasPermission(req.user, "read_resource")) {
    return res.status(403).json({ error: "Permission denied" })
  }

  res.status(200).json({ data: "ok" });
});

app.post("/resource4", (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" })
  }
  res.status(201).json({ message: "Created" });
});

// Dummy function for permission check
function hasPermission(user: any, permission: string) {
  return true;
}
