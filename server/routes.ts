import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import { randomUUID } from "crypto";
import express from "express";
import { storage } from "./storage";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const expressLayouts = require("express-ejs-layouts");

  const wowDashRoot = path.join(__dirname, "../WowDash");

  app.use(express.static(path.join(wowDashRoot, "public")));
  app.use("/css", express.static(path.join(wowDashRoot, "public/css")));
  app.use("/fonts", express.static(path.join(wowDashRoot, "public/fonts")));
  app.use("/images", express.static(path.join(wowDashRoot, "public/images")));
  app.use("/js", express.static(path.join(wowDashRoot, "public/js")));
  app.use("/webfonts", express.static(path.join(wowDashRoot, "public/webfonts")));
  app.use("/sass", express.static(path.join(wowDashRoot, "public/sass")));

  app.use(expressLayouts);
  app.set("layout", "./layout/layout");
  app.set("views", path.join(wowDashRoot, "views"));
  app.set("view engine", "ejs");

  // ── Employee API ────────────────────────────────────────────────
  app.get("/api/employees", async (_req: Request, res: Response) => {
    const employees = await storage.getEmployees();
    res.json(employees);
  });

  app.post("/api/employees", async (req: Request, res: Response) => {
    const { name, email, mobile, userId, password, designation } = req.body;
    if (!name || !email || !mobile || !userId || !password || !designation) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const validDesignations = ["Manager", "Caller", "Tax Preparer"];
    if (!validDesignations.includes(designation)) {
      return res.status(400).json({ message: "Invalid designation" });
    }
    const employee = await storage.createEmployee({ name, email, mobile, userId, password, designation });
    res.status(201).json(employee);
  });

  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    const employee = await storage.getEmployee(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  });

  app.put("/api/employees/:id", async (req: Request, res: Response) => {
    const { name, email, mobile, userId, designation, password } = req.body;
    const patch: Partial<{ name: string; email: string; mobile: string; userId: string; designation: "Manager" | "Caller" | "Tax Preparer"; password: string }> = { name, email, mobile, userId, designation };
    if (password) patch.password = password;
    const updated = await storage.updateEmployee(req.params.id, patch);
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  });

  app.patch("/api/employees/:id/deactivate", async (req: Request, res: Response) => {
    const updated = await storage.deactivateEmployee(req.params.id);
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  });

  app.patch("/api/employees/:id/activate", async (req: Request, res: Response) => {
    const updated = await storage.activateEmployee(req.params.id);
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  });

  app.delete("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteEmployee(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Employee not found" });
      res.json({ message: "Employee deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/employees/:id]", err);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // ── Financial Years API ─────────────────────────────────────────
  app.get("/api/financial-years", async (_req: Request, res: Response) => {
    res.json(await storage.getFinancialYears());
  });

  app.post("/api/financial-years", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "FY name is required" });
    res.status(201).json(await storage.createFinancialYear(name.trim()));
  });

  app.put("/api/financial-years/:id", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "FY name is required" });
    const updated = await storage.updateFinancialYear(req.params.id, name.trim());
    if (!updated) return res.status(404).json({ message: "Financial Year not found" });
    res.json(updated);
  });

  app.delete("/api/financial-years/:id", async (req: Request, res: Response) => {
    try {
      const fy = (await storage.getFinancialYears()).find(f => f.id === req.params.id);
      if (!fy) return res.status(404).json({ message: "Financial Year not found" });
      const filings = await storage.getItrFilings();
      const usageCount = filings.filter(f => f.financialYear === fy.name).length;
      if (usageCount > 0) {
        return res.status(409).json({ message: `Cannot delete '${fy.name}' — it is used in ${usageCount} ITR filing(s).` });
      }
      const deleted = await storage.deleteFinancialYear(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Financial Year not found" });
      res.json({ message: "Financial Year deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/financial-years/:id]", err);
      res.status(500).json({ message: "Failed to delete financial year" });
    }
  });

  // ── ITR Statuses API ────────────────────────────────────────────
  app.get("/api/itr-statuses", async (_req: Request, res: Response) => {
    res.json(await storage.getItrStatuses());
  });

  app.post("/api/itr-statuses", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Status name is required" });
    res.status(201).json(await storage.createItrStatus(name.trim()));
  });

  app.put("/api/itr-statuses/:id", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Status name is required" });
    const updated = await storage.updateItrStatus(req.params.id, name.trim());
    if (!updated) return res.status(404).json({ message: "Status not found" });
    res.json(updated);
  });

  app.delete("/api/itr-statuses/:id", async (req: Request, res: Response) => {
    try {
      const status = (await storage.getItrStatuses()).find(s => s.id === req.params.id);
      if (!status) return res.status(404).json({ message: "Status not found" });
      const filings = await storage.getItrFilings();
      const usageCount = filings.filter(f => {
        if (f.filingStatus === status.name) return true;
        if (f.statusHistory && f.statusHistory.some(h => h.status === status.name)) return true;
        return false;
      }).length;
      if (usageCount > 0) {
        return res.status(409).json({ message: `Cannot delete '${status.name}' — it is used in ${usageCount} ITR filing(s).` });
      }
      const deleted = await storage.deleteItrStatus(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Status not found" });
      res.json({ message: "Status deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/itr-statuses/:id]", err);
      res.status(500).json({ message: "Failed to delete status" });
    }
  });

  // ── ITR Status 2 Options API ─────────────────────────────────────
  app.get("/api/itr-status2", async (_req: Request, res: Response) => {
    res.json(await storage.getItrStatus2Options());
  });

  app.post("/api/itr-status2", async (req: Request, res: Response) => {
    const { name, role, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    if (!['caller', 'preparer', 'common'].includes(role)) return res.status(400).json({ message: "Role must be caller, preparer, or common" });
    res.status(201).json(await storage.createItrStatus2Option(name.trim(), role, color || undefined));
  });

  app.put("/api/itr-status2/:id", async (req: Request, res: Response) => {
    const { name, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    const updated = await storage.updateItrStatus2Option(req.params.id, name.trim(), color || undefined);
    if (!updated) return res.status(404).json({ message: "Option not found" });
    res.json(updated);
  });

  app.delete("/api/itr-status2/:id", async (req: Request, res: Response) => {
    try {
      const option = (await storage.getItrStatus2Options()).find(o => o.id === req.params.id);
      if (!option) return res.status(404).json({ message: "Option not found" });
      const filings = await storage.getItrFilings();
      const filingUsage = filings.filter(f => {
        if (f.status2Caller === option.name || f.status2Preparer === option.name) return true;
        if (f.statusHistory && f.statusHistory.some((h: any) => h.status === option.name)) return true;
        return false;
      }).length;
      const activityLogCount = await storage.countInfoRequestsByType(option.name);
      const totalUsage = filingUsage + activityLogCount;
      if (totalUsage > 0) {
        return res.status(409).json({ message: `Cannot delete '${option.name}' — it is used in ${totalUsage} filing progress entry(s) or activity log entry(s).` });
      }
      const deleted = await storage.deleteItrStatus2Option(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Option not found" });
      res.json({ message: "Option deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/itr-status2/:id]", err);
      res.status(500).json({ message: "Failed to delete option" });
    }
  });

  app.patch("/api/itr-filings/:id/return-details", async (req: Request, res: Response) => {
    const { itrType, filingType, returnOutcome } = req.body;
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const updated = await storage.updateItrFiling(req.params.id, {
      itrType: 'itrType' in req.body ? (itrType || null) : filing.itrType,
      filingType: 'filingType' in req.body ? (filingType || null) : filing.filingType,
      returnOutcome: 'returnOutcome' in req.body ? (returnOutcome || null) : filing.returnOutcome,
    } as any);
    res.json(updated);
  });

  app.get("/api/itr-filings/:id/return-detail-logs", async (req: Request, res: Response) => {
    const logs = await storage.getReturnDetailLogs(req.params.id);
    res.json(logs);
  });

  app.post("/api/itr-filings/:id/return-detail-logs", async (req: Request, res: Response) => {
    const { fieldLabel, newValue } = req.body;
    if (!fieldLabel) return res.status(400).json({ message: "fieldLabel required" });
    const log = await storage.addReturnDetailLog(req.params.id, fieldLabel, newValue ?? '');
    res.json(log);
  });

  app.patch("/api/itr-filings/:id/status2", async (req: Request, res: Response) => {
    const { role, value } = req.body;
    if (!['caller', 'preparer'].includes(role)) return res.status(400).json({ message: "role must be 'caller' or 'preparer'" });
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const updateData: Record<string, string | null> = {};
    if (role === 'caller') updateData.status2Caller = value ?? null;
    if (role === 'preparer') updateData.status2Preparer = value ?? null;
    const updated = await storage.updateItrFiling(req.params.id, updateData as any);
    res.json(updated);
  });

  // ── ITR Types API ────────────────────────────────────────────────
  app.get("/api/itr-types", async (_req: Request, res: Response) => {
    res.json(await storage.getItrTypes());
  });

  app.post("/api/itr-types", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    res.status(201).json(await storage.createItrType(name.trim()));
  });

  app.put("/api/itr-types/:id", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    const updated = await storage.updateItrType(req.params.id, name.trim());
    if (!updated) return res.status(404).json({ message: "ITR type not found" });
    res.json(updated);
  });

  app.delete("/api/itr-types/:id", async (req: Request, res: Response) => {
    try {
      const itrType = (await storage.getItrTypes()).find(t => t.id === req.params.id);
      if (!itrType) return res.status(404).json({ message: "ITR type not found" });
      const filings = await storage.getItrFilings();
      const usageCount = filings.filter(f => f.itrType === itrType.name).length;
      if (usageCount > 0) {
        return res.status(409).json({ message: `Cannot delete '${itrType.name}' — it is used in ${usageCount} ITR filing(s).` });
      }
      const deleted = await storage.deleteItrType(req.params.id);
      if (!deleted) return res.status(404).json({ message: "ITR type not found" });
      res.json({ message: "ITR type deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/itr-types/:id]", err);
      res.status(500).json({ message: "Failed to delete ITR type" });
    }
  });

  // ── Return Outcomes API ──────────────────────────────────────────
  app.get("/api/return-outcomes", async (_req: Request, res: Response) => {
    res.json(await storage.getReturnOutcomes());
  });

  app.post("/api/return-outcomes", async (req: Request, res: Response) => {
    const { name, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    res.status(201).json(await storage.createReturnOutcome(name.trim(), color || undefined));
  });

  app.put("/api/return-outcomes/:id", async (req: Request, res: Response) => {
    const { name, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    const updated = await storage.updateReturnOutcome(req.params.id, name.trim(), color || undefined);
    if (!updated) return res.status(404).json({ message: "Return outcome not found" });
    res.json(updated);
  });

  app.delete("/api/return-outcomes/:id", async (req: Request, res: Response) => {
    try {
      const outcome = (await storage.getReturnOutcomes()).find(o => o.id === req.params.id);
      if (!outcome) return res.status(404).json({ message: "Return outcome not found" });
      const filings = await storage.getItrFilings();
      const usageCount = filings.filter(f => f.returnOutcome === outcome.name).length;
      if (usageCount > 0) {
        return res.status(409).json({ message: `Cannot delete '${outcome.name}' — it is used in ${usageCount} ITR filing(s).` });
      }
      const deleted = await storage.deleteReturnOutcome(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Return outcome not found" });
      res.json({ message: "Return outcome deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/return-outcomes/:id]", err);
      res.status(500).json({ message: "Failed to delete return outcome" });
    }
  });

  // ── Sources API ─────────────────────────────────────────────────
  app.get("/api/sources", async (_req: Request, res: Response) => {
    res.json(await storage.getSources());
  });

  app.post("/api/sources", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Source name is required" });
    res.status(201).json(await storage.createSource(name.trim()));
  });

  app.put("/api/sources/:id", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Source name is required" });
    const updated = await storage.updateSource(req.params.id, name.trim());
    if (!updated) return res.status(404).json({ message: "Source not found" });
    res.json(updated);
  });

  app.delete("/api/sources/:id", async (req: Request, res: Response) => {
    try {
      const source = (await storage.getSources()).find(s => s.id === req.params.id);
      if (!source) return res.status(404).json({ message: "Source not found" });
      const clients = await storage.getClients();
      const usageCount = clients.filter(c => c.source === source.name).length;
      if (usageCount > 0) {
        return res.status(409).json({ message: `Cannot delete '${source.name}' — it is used in ${usageCount} client record(s).` });
      }
      const deleted = await storage.deleteSource(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Source not found" });
      res.json({ message: "Source deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/sources/:id]", err);
      res.status(500).json({ message: "Failed to delete source" });
    }
  });

  // ── Paid To API ──────────────────────────────────────────────────
  app.get("/api/paid-to", async (_req: Request, res: Response) => {
    res.json(await storage.getPaidTos());
  });

  app.post("/api/paid-to", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });
    res.status(201).json(await storage.createPaidTo(name.trim()));
  });

  app.put("/api/paid-to/:id", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });
    const updated = await storage.updatePaidTo(req.params.id, name.trim());
    if (!updated) return res.status(404).json({ message: "Paid To not found" });
    res.json(updated);
  });

  app.delete("/api/paid-to/:id", async (req: Request, res: Response) => {
    try {
      const paidTo = (await storage.getPaidTos()).find(p => p.id === req.params.id);
      if (!paidTo) return res.status(404).json({ message: "Paid To not found" });
      const filings = await storage.getItrFilings();
      let usageCount = 0;
      for (const f of filings) {
        const entries = await storage.getPaymentEntries(f.id);
        if (entries.some(e => e.paidTo === paidTo.name || e.refundedTo === paidTo.name)) usageCount++;
      }
      if (usageCount > 0) {
        return res.status(409).json({ message: `Cannot delete '${paidTo.name}' — it is used in payment entries across ${usageCount} ITR filing(s).` });
      }
      const deleted = await storage.deletePaidTo(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Paid To not found" });
      res.json({ message: "Paid To deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/paid-to/:id]", err);
      res.status(500).json({ message: "Failed to delete paid to option" });
    }
  });

  // ── Mode of Payment API ──────────────────────────────────────────
  app.get("/api/mode-of-payment", async (_req: Request, res: Response) => {
    res.json(await storage.getModeOfPayments());
  });

  app.post("/api/mode-of-payment", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });
    res.status(201).json(await storage.createModeOfPayment(name.trim()));
  });

  app.put("/api/mode-of-payment/:id", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });
    const updated = await storage.updateModeOfPayment(req.params.id, name.trim());
    if (!updated) return res.status(404).json({ message: "Mode of Payment not found" });
    res.json(updated);
  });

  app.delete("/api/mode-of-payment/:id", async (req: Request, res: Response) => {
    try {
      const mop = (await storage.getModeOfPayments()).find(m => m.id === req.params.id);
      if (!mop) return res.status(404).json({ message: "Mode of Payment not found" });
      const filings = await storage.getItrFilings();
      let usageCount = 0;
      for (const f of filings) {
        const entries = await storage.getPaymentEntries(f.id);
        if (entries.some(e => e.modeOfPayment === mop.name)) usageCount++;
      }
      if (usageCount > 0) {
        return res.status(409).json({ message: `Cannot delete '${mop.name}' — it is used in payment entries across ${usageCount} ITR filing(s).` });
      }
      const deleted = await storage.deleteModeOfPayment(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Mode of Payment not found" });
      res.json({ message: "Mode of Payment deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/mode-of-payment/:id]", err);
      res.status(500).json({ message: "Failed to delete mode of payment" });
    }
  });

  // ── Dropdown Reorder (shared) ─────────────────────────────────
  const TABLE_MAP: Record<string, string> = {
    'financial-years':   'financial_years',
    'itr-types':         'itr_types',
    'paid-to':           'paid_tos',
    'mode-of-payment':   'mode_of_payments',
    'sources':           'sources',
    'return-outcomes':   'return_outcomes',
    'itr-status2':       'itr_status2_options',
  };
  app.patch("/api/dropdown/:entity/reorder", async (req: Request, res: Response) => {
    try {
      const table = TABLE_MAP[req.params.entity];
      if (!table) return res.status(400).json({ message: "Unknown dropdown entity" });
      const { ids } = req.body;
      if (!Array.isArray(ids)) return res.status(400).json({ message: "ids must be an array" });
      await storage.reorderDropdown(table, ids);
      res.json({ ok: true });
    } catch (err: any) {
      console.error("[PATCH /api/dropdown/:entity/reorder]", err);
      res.status(500).json({ message: "Failed to reorder" });
    }
  });

  // ── Clients API ─────────────────────────────────────────────────
  app.get("/api/clients", async (_req: Request, res: Response) => {
    res.json(await storage.getClients());
  });

  app.get("/api/clients/:id", async (req: Request, res: Response) => {
    const client = await storage.getClient(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  });

  app.post("/api/clients", async (req: Request, res: Response) => {
    const { name, mobile, pan } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    if (!mobile?.trim()) return res.status(400).json({ message: "Mobile is required" });
    if (!pan?.trim()) return res.status(400).json({ message: "PAN is required" });
    const existing = await storage.getClientByPan(pan.trim());
    if (existing) return res.status(409).json({ message: "Client with this PAN already exists." });
    const client = await storage.createClient({
      name: req.body.name?.trim() || "",
      email: req.body.email?.trim() || "",
      mobile: req.body.mobile?.trim() || "",
      alternateMobile: req.body.alternateMobile?.trim() || "",
      pan: req.body.pan?.trim().toUpperCase() || "",
      itrPassword: req.body.itrPassword?.trim() || "",
      dob: req.body.dob?.trim() || "",
      aadharNo: req.body.aadharNo?.trim() || "",
      caller: req.body.caller?.trim() || "",
      source: req.body.source?.trim() || "",
      remarks: req.body.remarks?.trim() || "",
    });
    res.status(201).json(client);
  });

  app.put("/api/clients/:id", async (req: Request, res: Response) => {
    const { name, mobile, pan } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    if (!mobile?.trim()) return res.status(400).json({ message: "Mobile is required" });
    if (!pan?.trim()) return res.status(400).json({ message: "PAN is required" });
    const existing = await storage.getClientByPan(pan.trim());
    if (existing && existing.id !== req.params.id) {
      return res.status(409).json({ message: "Client with this PAN already exists." });
    }
    const updated = await storage.updateClient(req.params.id, {
      name: req.body.name?.trim() || "",
      email: req.body.email?.trim() || "",
      mobile: req.body.mobile?.trim() || "",
      alternateMobile: req.body.alternateMobile?.trim() || "",
      pan: req.body.pan?.trim().toUpperCase() || "",
      itrPassword: req.body.itrPassword?.trim() || "",
      dob: req.body.dob?.trim() || "",
      aadharNo: req.body.aadharNo?.trim() || "",
      caller: req.body.caller?.trim() || "",
      source: req.body.source?.trim() || "",
      remarks: req.body.remarks?.trim() || "",
    });
    if (!updated) return res.status(404).json({ message: "Client not found" });
    res.json(updated);
  });

  app.delete("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) return res.status(404).json({ message: "Client not found" });
      const filings = await storage.getItrFilingsByClientId(req.params.id);
      if (filings.length > 0) {
        return res.status(409).json({
          message: `This client has ${filings.length} active service(s). Remove these services first before deleting the client.`,
          filings: filings.map(f => ({ id: f.id, service: "ITR Individual Filing", financialYear: f.financialYear })),
        });
      }
      const deleted = await storage.deleteClient(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Client not found" });
      res.json({ message: "Client deleted" });
    } catch (err: any) {
      console.error("[DELETE /api/clients/:id] error:", err);
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  app.patch("/api/clients/:id/toggle-status", async (req: Request, res: Response) => {
    const updated = await storage.toggleClientStatus(req.params.id);
    if (!updated) return res.status(404).json({ message: "Client not found" });
    res.json(updated);
  });

  app.get("/api/clients/:id/itr-filings", async (req: Request, res: Response) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) return res.status(404).json({ message: "Client not found" });
      const filings = await storage.getItrFilingsByClientId(req.params.id);
      const enriched = await Promise.all(filings.map(async (f) => {
        const summary = await storage.getPaymentSummary(f.id);
        const entries = await storage.getPaymentEntries(f.id);
        const amountDue = Math.max(0, summary.fee - summary.discount);
        const { totalPaid, balance: payBalance } = calcPaymentTotals(entries, amountDue);
        let paymentStatus = "—";
        if (summary.fee > 0) {
          if (payBalance <= 0)    paymentStatus = "Paid";
          else if (totalPaid > 0) paymentStatus = "Partial";
          else                    paymentStatus = "Unpaid";
        }
        const history = f.statusHistory || [];
        const latestStatus = history.length > 0 ? history[history.length - 1].status : f.filingStatus;
        const finalFee = amountDue;
        return { ...f, filingStatus: latestStatus, client, paymentStatus, fee: summary.fee, discount: summary.discount, finalFee, totalPaid, balance: payBalance, paymentHandledBy: summary.handledBy || null };
      }));
      res.json(enriched);
    } catch (err: any) {
      console.error("GET /api/clients/:id/itr-filings error:", err);
      res.status(500).json({ message: "Failed to load client services" });
    }
  });

  // ── ITR Filings API ─────────────────────────────────────────────
  app.get("/api/itr-filings", async (_req: Request, res: Response) => {
    const filings = await storage.getItrFilings();
    const clients = await storage.getClients();
    const clientMap = new Map(clients.map((c) => [c.id, c]));
    const enriched = await Promise.all(filings.map(async (f) => {
      const summary = await storage.getPaymentSummary(f.id);
      const entries = await storage.getPaymentEntries(f.id);
      const amountDue = Math.max(0, summary.fee - summary.discount);
      const { totalPaid, balance: payBalance } = calcPaymentTotals(entries, amountDue);
      let paymentStatus = "—";
      if (summary.fee > 0) {
        if (payBalance <= 0)    paymentStatus = "Paid";
        else if (totalPaid > 0) paymentStatus = "Partial";
        else                    paymentStatus = "Unpaid";
      }
      const history = f.statusHistory || [];
      const latestStatus = history.length > 0 ? history[history.length - 1].status : f.filingStatus;
      const finalFee = amountDue;
      return { ...f, filingStatus: latestStatus, client: clientMap.get(f.clientId) || null, paymentStatus, finalFee, totalPaid, balance: payBalance, paymentHandledBy: summary.handledBy || null };
    }));
    res.json(enriched);
  });

  app.get("/api/itr-filings/:id", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const client = await storage.getClient(filing.clientId);
    res.json({ ...filing, client: client || null });
  });

  app.delete("/api/itr-filings/:id", async (req: Request, res: Response) => {
    try {
      const filing = await storage.getItrFiling(req.params.id);
      if (!filing) return res.status(404).json({ message: "Filing not found" });
      const client = await storage.getClient(filing.clientId);
      if (client) {
        const confirmedPan = req.body.pan?.trim().toUpperCase();
        if (!confirmedPan) return res.status(400).json({ message: "PAN confirmation is required." });
        if (client.pan.toUpperCase() !== confirmedPan) {
          return res.status(400).json({ message: "PAN number does not match. Deletion cancelled." });
        }
      }
      const deleted = await storage.deleteItrFiling(req.params.id);
      if (!deleted) return res.status(500).json({ message: "Failed to delete filing." });
      res.json({ message: "Filing and all associated data deleted successfully." });
    } catch (err: any) {
      console.error("[DELETE /api/itr-filings/:id]", err);
      res.status(500).json({ message: "Failed to delete filing" });
    }
  });

  app.post("/api/itr-filings", async (req: Request, res: Response) => {
    const { clientId, financialYear } = req.body;
    if (!clientId?.trim()) return res.status(400).json({ message: "clientId is required" });
    if (!financialYear?.trim()) return res.status(400).json({ message: "Financial Year is required" });
    const client = await storage.getClient(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });
    if (client.status !== "Active") return res.status(400).json({ message: "Client is not active" });
    const existing = await storage.getItrFilingByClientAndFY(clientId, financialYear.trim());
    if (existing) return res.status(409).json({ message: "This client is already assigned to ITR filing for the selected Financial Year." });
    const now = new Date().toISOString();
    const filing = await storage.createItrFiling({
      clientId,
      financialYear: financialYear.trim(),
      assignedDate: now,
      preparer: req.body.preparer?.trim() || "",
      filingStatus: "Opened",
      statusHistory: [{ status: "Opened", timestamp: now, updatedBy: client.caller || undefined }],
      selectedIncomeHeads: [],
      incomeData: {},
      deductions: { notes: "", documents: [] },
    });
    res.status(201).json({ ...filing, client });
  });

  app.put("/api/itr-filings/:id", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const { preparer, selectedIncomeHeads, incomeData, deductions } = req.body;
    const newPreparer = preparer ?? filing.preparer;
    const isNewPreparer = !!(newPreparer && !filing.preparer);
    const now = new Date().toISOString();
    const preparerAssignedAt = isNewPreparer ? now : (filing.preparerAssignedAt ?? undefined);
    const existingHistory = filing.statusHistory || [{ status: "Opened", timestamp: filing.assignedDate }];
    const { assignedBy } = req.body;
    const statusHistory = isNewPreparer
      ? [...existingHistory, { status: "Tax Preparer Assigned", updatedBy: assignedBy?.trim() || 'System', preparerName: newPreparer, timestamp: now }]
      : existingHistory;
    const updated = await storage.updateItrFiling(req.params.id, {
      preparer: newPreparer,
      preparerAssignedAt,
      statusHistory,
      selectedIncomeHeads: selectedIncomeHeads ?? filing.selectedIncomeHeads,
      incomeData: incomeData ?? filing.incomeData,
      deductions: deductions ?? filing.deductions ?? { notes: "", documents: [] },
    });
    const client = await storage.getClient(updated!.clientId);
    res.json({ ...updated, client: client || null });
  });

  app.patch("/api/itr-filings/:id/status", async (req: Request, res: Response) => {
    const { filingStatus, note, updatedBy, notifyInfo } = req.body;
    if (!filingStatus?.trim()) return res.status(400).json({ message: "filingStatus is required" });
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const now = new Date().toISOString();
    const entry: { status: string; timestamp: string; note?: string; updatedBy?: string; notifyInfo?: string } = { status: filingStatus.trim(), timestamp: now };
    if (note?.trim()) entry.note = note.trim();
    if (updatedBy?.trim()) entry.updatedBy = updatedBy.trim();
    if (notifyInfo?.trim()) entry.notifyInfo = notifyInfo.trim();
    const newHistory = [
      ...(filing.statusHistory || [{ status: "Opened", timestamp: filing.assignedDate }]),
      entry,
    ];
    const updated = await storage.updateItrFiling(req.params.id, {
      filingStatus: filingStatus.trim(),
      statusHistory: newHistory,
    });
    const client = await storage.getClient(updated!.clientId);
    res.json({ ...updated, client: client || null });
  });

  app.post("/api/itr-filings/:id/documents/:head", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const head = decodeURIComponent(req.params.head);
    const { name, size, mimeType, data } = req.body;
    if (!name || !data) return res.status(400).json({ message: "name and data are required" });
    const doc = { id: randomUUID(), name, size: size || 0, mimeType: mimeType || "application/octet-stream", data, uploadedAt: new Date().toISOString() };
    const incomeData = { ...(filing.incomeData || {}) };
    if (!incomeData[head]) incomeData[head] = { fields: {}, documents: [] };
    incomeData[head] = { ...incomeData[head], documents: [...(incomeData[head].documents || []), doc] };
    await storage.updateItrFiling(req.params.id, { incomeData });
    res.status(201).json(doc);
  });

  app.delete("/api/itr-filings/:id/documents/:head/:docId", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const head = decodeURIComponent(req.params.head);
    const incomeData = { ...(filing.incomeData || {}) };
    if (incomeData[head]) {
      incomeData[head] = { ...incomeData[head], documents: (incomeData[head].documents || []).filter((d) => d.id !== req.params.docId) };
    }
    await storage.updateItrFiling(req.params.id, { incomeData });
    res.json({ message: "Document deleted" });
  });

  app.post("/api/itr-filings/:id/deductions/documents", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const { name, size, mimeType, data } = req.body;
    if (!name || !data) return res.status(400).json({ message: "name and data are required" });
    const doc = { id: randomUUID(), name, size: size || 0, mimeType: mimeType || "application/octet-stream", data, uploadedAt: new Date().toISOString() };
    const deductions = { ...(filing.deductions || { notes: "", documents: [] }) };
    deductions.documents = [...(deductions.documents || []), doc];
    await storage.updateItrFiling(req.params.id, { deductions });
    res.status(201).json(doc);
  });

  app.delete("/api/itr-filings/:id/deductions/documents/:docId", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const deductions = { ...(filing.deductions || { notes: "", documents: [] }) };
    deductions.documents = (deductions.documents || []).filter((d) => d.id !== req.params.docId);
    await storage.updateItrFiling(req.params.id, { deductions });
    res.json({ message: "Document deleted" });
  });

  app.delete("/api/itr-filings/:id", async (req: Request, res: Response) => {
    const deleted = await storage.deleteItrFiling(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Filing not found" });
    res.json({ message: "Filing deleted" });
  });

  // ── Chat messages ────────────────────────────────────────────────
  app.get("/api/itr-filings/:id/messages", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const messages = await storage.getChatMessages(req.params.id);
    res.json(messages);
  });

  app.post("/api/itr-filings/:id/messages", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const { userName, message } = req.body;
    if (!userName?.trim()) return res.status(400).json({ message: "Name is required" });
    if (!message?.trim()) return res.status(400).json({ message: "Message is required" });
    const msg = await storage.addChatMessage(req.params.id, { userName: userName.trim(), message: message.trim() });
    res.status(201).json(msg);
  });

  // ── Info requests ─────────────────────────────────────────────
  app.get("/api/itr-filings/:id/info-requests", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    res.json(await storage.getInfoRequests(req.params.id));
  });

  app.post("/api/itr-filings/:id/info-requests", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const { message, type, senderName, senderRole, files } = req.body;
    const hasFiles = Array.isArray(files) && files.length > 0;
    const item = await storage.addInfoRequest(req.params.id, {
      message: message?.trim() || '',
      type: type || "request",
      senderName: senderName || undefined,
      senderRole: senderRole || undefined,
      files: hasFiles ? files : undefined,
    });
    res.status(201).json(item);
  });

  // ── Estimate ──────────────────────────────────────────────────
  app.get("/api/itr-filings/:id/estimate", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const estimates = await storage.getEstimates(req.params.id);
    res.json(estimates);
  });

  app.post("/api/itr-filings/:id/estimate", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const { type: estType, senderName, senderRole, files, remarks, preparedAt } = req.body;
    const submission = await storage.addEstimate(req.params.id, {
      type: estType || 'estimate',
      senderName: senderName || undefined,
      senderRole: senderRole || undefined,
      files: Array.isArray(files) && files.length > 0 ? files : undefined,
      remarks: remarks?.trim() || "",
      preparedAt: preparedAt || undefined,
    });
    res.status(201).json(submission);
  });

  // ── Reassignment ──────────────────────────────────────────────
  app.get("/api/itr-filings/:id/reassignments", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const list = await storage.getReassignments(req.params.id);
    res.json(list);
  });

  app.post("/api/itr-filings/:id/reassign", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const { role, fromName, toName, remarks } = req.body;
    if (!role || !toName) return res.status(400).json({ message: "role and toName are required" });
    const updateData: Record<string, unknown> = {};
    if (role === 'preparer') updateData.preparer = toName;
    if (role === 'caller')   updateData.caller   = toName;
    if (role === 'manager')  updateData.manager  = toName;
    await storage.updateItrFiling(req.params.id, updateData as any);
    const event = await storage.addReassignment(req.params.id, {
      role,
      fromName: fromName || '—',
      toName,
      remarks: remarks?.trim() || undefined,
    });
    res.status(201).json(event);
  });

  // ── Payment helpers ────────────────────────────────────────────
  function calcPaymentTotals(entries: any[], finalFee: number) {
    const payments  = entries.filter(e => e.type !== 'refund');
    const refunds   = entries.filter(e => e.type === 'refund');
    const totalPaid     = payments.reduce((s: number, e: any) => s + e.amount, 0);
    const totalRefunded = refunds.reduce((s: number, e: any) => s + e.amount, 0);
    const balance = finalFee - totalPaid + totalRefunded;
    return { totalPaid, totalRefunded, balance };
  }

  // ── Payment ──────────────────────────────────────────────────────
  app.get("/api/itr-filings/:id/payment", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const summary = await storage.getPaymentSummary(req.params.id);
    const entries = await storage.getPaymentEntries(req.params.id);
    const finalFee = summary.fee - summary.discount;
    const { totalPaid, totalRefunded, balance } = calcPaymentTotals(entries, finalFee);
    res.json({ fee: summary.fee, discount: summary.discount, finalFee, entries, totalPaid, totalRefunded, balance, handledBy: summary.handledBy ?? null });
  });

  app.patch("/api/itr-filings/:id/payment", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const fee = parseFloat(req.body.fee);
    const discount = parseFloat(req.body.discount);
    if (isNaN(fee) || isNaN(discount)) return res.status(400).json({ message: "fee and discount must be numbers" });
    if (fee < 0 || discount < 0) return res.status(400).json({ message: "Values cannot be negative" });
    const handledBy = typeof req.body.handledBy === 'string' ? req.body.handledBy.trim() || undefined : undefined;
    const summary = await storage.updatePaymentSummary(req.params.id, { fee, discount, handledBy });
    const entries = await storage.getPaymentEntries(req.params.id);
    const finalFee = summary.fee - summary.discount;
    const { totalPaid, totalRefunded, balance } = calcPaymentTotals(entries, finalFee);
    res.json({ fee: summary.fee, discount: summary.discount, finalFee, entries, totalPaid, totalRefunded, balance, handledBy: summary.handledBy ?? null });
  });

  app.post("/api/itr-filings/:id/payment/entries", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "amount must be a positive number" });
    const entry = await storage.addPaymentEntry(req.params.id, {
      type: 'payment',
      amount,
      paidTo: req.body.paidTo?.trim() || undefined,
      modeOfPayment: req.body.modeOfPayment?.trim() || undefined,
      note: req.body.note?.trim() || undefined,
      proofFileName: req.body.proofFileName?.trim() || undefined,
      proofFileData: req.body.proofFileData?.trim() || undefined,
    });
    res.status(201).json(entry);
  });

  app.post("/api/itr-filings/:id/payment/refunds", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "amount must be a positive number" });
    if (!req.body.refundedTo?.trim()) return res.status(400).json({ message: "Issue Refund From is required" });
    // Validate cumulative refunds do not exceed total paid
    const entries = await storage.getPaymentEntries(req.params.id);
    const totalPaid      = entries.filter((e: any) => e.type !== 'refund').reduce((s: number, e: any) => s + e.amount, 0);
    const totalRefunded  = entries.filter((e: any) => e.type === 'refund').reduce((s: number, e: any) => s + e.amount, 0);
    const remaining      = totalPaid - totalRefunded;
    if (amount > remaining) {
      return res.status(400).json({
        message: `Refund of ₹${amount.toLocaleString('en-IN')} not allowed. Already refunded ₹${totalRefunded.toLocaleString('en-IN')} of ₹${totalPaid.toLocaleString('en-IN')} paid. Remaining refundable: ₹${remaining.toLocaleString('en-IN')}.`
      });
    }
    const entry = await storage.addPaymentEntry(req.params.id, {
      type: 'refund',
      amount,
      refundedTo: req.body.refundedTo.trim(),
      note: req.body.reason?.trim() || undefined,
    });
    res.status(201).json(entry);
  });

  // Delete a single payment entry
  app.delete("/api/itr-filings/:id/payment/entries/:entryId", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    const ok = await storage.deletePaymentEntry(req.params.id, req.params.entryId);
    if (!ok) return res.status(404).json({ message: "Entry not found" });
    res.json({ success: true });
  });

  // Delete entire payment section (all entries + fee summary)
  app.delete("/api/itr-filings/:id/payment", async (req: Request, res: Response) => {
    const filing = await storage.getItrFiling(req.params.id);
    if (!filing) return res.status(404).json({ message: "Filing not found" });
    await storage.clearPaymentData(req.params.id);
    res.json({ success: true });
  });

  // ── Payments summary API ─────────────────────────────────────────
  app.get("/api/payments/itr-summary", async (_req: Request, res: Response) => {
    const filings = await storage.getItrFilings();
    const clients = await storage.getClients();
    const clientMap = new Map(clients.map((c) => [c.id, c]));

    let totalFee = 0, totalDiscount = 0, totalPaid = 0;
    const rows = await Promise.all(filings.map(async (f) => {
      const summary = await storage.getPaymentSummary(f.id);
      const entries = await storage.getPaymentEntries(f.id);
      const finalFee = Math.max(0, summary.fee - summary.discount);
      const { totalPaid: paid, balance } = calcPaymentTotals(entries, finalFee);
      totalFee      += summary.fee;
      totalDiscount += summary.discount;
      totalPaid     += paid;

      let paymentStatus = "—";
      if (summary.fee > 0) {
        if (balance <= 0)  paymentStatus = "Paid";
        else if (paid > 0) paymentStatus = "Partial";
        else               paymentStatus = "Unpaid";
      }

      const history = f.statusHistory || [];
      const filingStatus = history.length > 0 ? history[history.length - 1].status : f.filingStatus;
      const client = clientMap.get(f.clientId) || null;

      return {
        id: f.id,
        client,
        financialYear: f.financialYear,
        assignedDate: f.assignedDate,
        filingStatus,
        fee: summary.fee,
        discount: summary.discount,
        finalFee,
        paid,
        balance,
        paymentStatus,
        entries,
      };
    }));

    res.json({
      stats: {
        totalFilings: filings.length,
        totalFee,
        totalDiscount,
        totalPaid,
        totalBalance: Math.max(0, totalFee - totalDiscount - totalPaid),
      },
      rows,
    });
  });

  // ── WowDash page routes ─────────────────────────────────────────
  const pageRouter = require(path.join(wowDashRoot, "routes/routes"));
  pageRouter(app);

  return httpServer;
}
