import express, { Request, Response } from "express";

const app = express();

// Wrong status codes for authentication/authorization
app.get("/resource1", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ error: "Authentication required" })
  }

  if (!hasPermission(req.user, "read_resource")) {
    return res.status(401).json({ error: "Permission denied" })
  }

  res.status(200).json({ data: "ok" });
});

// Using 500 for client errors
app.post("/resource2", (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" })
  }
  res.status(201).json({ message: "Created" });
});

// Wrong 404 usage
app.get("/resource3/:id", (req: Request, res: Response) => {
  const resource = findResource(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: "Resource not found" })
  }
  res.status(200).json(resource);
});

// ===== GOOD CODE =====

// Correct authentication/authorization codes
app.get("/resource4", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" })
  }

  if (!hasPermission(req.user, "read_resource")) {
    return res.status(403).json({ error: "Permission denied" })
  }

  res.status(200).json({ data: "ok" });
});

// Correct client error code
app.post("/resource5", (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Name is required" })
  }
  res.status(201).json({ message: "Created" });
});

// Correct not found
app.get("/resource6/:id", (req: Request, res: Response) => {
  const resource = findResource(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: "Resource not found" })
  }
  res.status(200).json(resource);
});

// Extra BAD endpoint
app.put("/resource7/:id", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ error: "Unauthorized" })
  }

  if (!hasPermission(req.user, "edit_resource")) {
    return res.status(401).json({ error: "Forbidden" })
  }

  res.status(200).json({ message: "Updated" });
});

// Extra GOOD endpoint
app.delete("/resource8/:id", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" })
  }

  if (!hasPermission(req.user, "delete_resource")) {
    return res.status(403).json({ error: "Permission denied" })
  }

  res.status(204).send();
});

// Dummy helper functions
function hasPermission(user: any, permission: string) {
  return true;
}

function findResource(id: string) {
  if (id === "1") return { id: "1", name: "Test" };
  return null;
}
