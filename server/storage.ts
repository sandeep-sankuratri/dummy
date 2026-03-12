import { randomUUID } from "crypto";
import { Pool } from "pg";

export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  userId: string;
  password: string;
  designation: "Manager" | "Caller" | "Tax Preparer";
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface InsertEmployee {
  name: string;
  email: string;
  mobile: string;
  userId: string;
  password: string;
  designation: "Manager" | "Caller" | "Tax Preparer";
}

export interface FinancialYear {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface ItrStatus {
  id: string;
  name: string;
  createdAt: string;
}

export interface Source {
  id: string;
  name: string;
  createdAt: string;
}

export interface PaidTo {
  id: string;
  name: string;
  createdAt: string;
}

export interface ModeOfPayment {
  id: string;
  name: string;
  createdAt: string;
}

export interface ItrType {
  id: string;
  name: string;
  createdAt: string;
}

export interface ReturnOutcome {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface ReturnDetailLog {
  id: string;
  filingId: string;
  fieldLabel: string;
  newValue: string;
  changedAt: string;
}

export interface ItrStatus2Option {
  id: string;
  name: string;
  role: 'caller' | 'preparer' | 'common';
  color?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  mobile: string;
  alternateMobile: string;
  pan: string;
  itrPassword: string;
  dob: string;
  aadharNo: string;
  caller: string;
  source: string;
  remarks: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export type InsertClient = Omit<Client, "id" | "createdAt">;

export interface ChatMessage {
  id: string;
  filingId: string;
  userName: string;
  message: string;
  timestamp: string;
}

export interface StatusEntry {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface FilingDocument {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  data: string;
  uploadedAt: string;
}

export interface IncomeHeadData {
  fields: Record<string, string>;
  documents: FilingDocument[];
}

export interface Deductions {
  notes: string;
  documents: FilingDocument[];
}

export interface AttachmentFile {
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  fileData?: string;
}

export interface InfoRequest {
  id: string;
  filingId: string;
  type?: string;
  message: string;
  senderName?: string;
  senderRole?: string;
  files?: AttachmentFile[];
  timestamp: string;
}

export interface EstimateSubmission {
  id: string;
  filingId: string;
  type?: string;
  senderName?: string;
  senderRole?: string;
  files?: AttachmentFile[];
  remarks: string;
  submittedAt: string;
  preparedAt?: string;
}

export interface ItrFiling {
  id: string;
  clientId: string;
  financialYear: string;
  assignedDate: string;
  preparer: string;
  preparerAssignedAt?: string;
  caller?: string;
  filingStatus: string;
  statusHistory: StatusEntry[];
  selectedIncomeHeads: string[];
  incomeData: Record<string, IncomeHeadData>;
  deductions: Deductions;
  status2Caller?: string;
  status2Preparer?: string;
  manager?: string;
  itrType?: string;
  filingType?: string;
  returnOutcome?: string;
  createdAt: string;
}

export interface ReassignmentEvent {
  id: string;
  filingId: string;
  role: 'caller' | 'preparer' | 'manager';
  fromName: string;
  toName: string;
  remarks?: string;
  timestamp: string;
}

export type InsertItrFiling = Omit<ItrFiling, "id" | "createdAt">;

export interface PaymentSummary {
  fee: number;
  discount: number;
  handledBy?: string;
}

export interface PaymentEntry {
  id: string;
  filingId: string;
  type?: 'payment' | 'refund';
  amount: number;
  paidTo?: string;
  refundedTo?: string;
  modeOfPayment?: string;
  note?: string;
  proofFileName?: string;
  proofFileData?: string;
  timestamp: string;
}

export interface IStorage {
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(emp: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, data: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deactivateEmployee(id: string): Promise<Employee | undefined>;
  activateEmployee(id: string): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  getFinancialYears(): Promise<FinancialYear[]>;
  createFinancialYear(name: string): Promise<FinancialYear>;
  updateFinancialYear(id: string, name: string): Promise<FinancialYear | undefined>;
  deleteFinancialYear(id: string): Promise<boolean>;
  getItrStatuses(): Promise<ItrStatus[]>;
  createItrStatus(name: string): Promise<ItrStatus>;
  updateItrStatus(id: string, name: string): Promise<ItrStatus | undefined>;
  deleteItrStatus(id: string): Promise<boolean>;
  getSources(): Promise<Source[]>;
  createSource(name: string): Promise<Source>;
  updateSource(id: string, name: string): Promise<Source | undefined>;
  deleteSource(id: string): Promise<boolean>;
  getPaidTos(): Promise<PaidTo[]>;
  createPaidTo(name: string): Promise<PaidTo>;
  updatePaidTo(id: string, name: string): Promise<PaidTo | undefined>;
  deletePaidTo(id: string): Promise<boolean>;
  getModeOfPayments(): Promise<ModeOfPayment[]>;
  createModeOfPayment(name: string): Promise<ModeOfPayment>;
  updateModeOfPayment(id: string, name: string): Promise<ModeOfPayment | undefined>;
  deleteModeOfPayment(id: string): Promise<boolean>;
  getItrTypes(): Promise<ItrType[]>;
  createItrType(name: string): Promise<ItrType>;
  updateItrType(id: string, name: string): Promise<ItrType | undefined>;
  deleteItrType(id: string): Promise<boolean>;
  getReturnOutcomes(): Promise<ReturnOutcome[]>;
  createReturnOutcome(name: string, color?: string): Promise<ReturnOutcome>;
  updateReturnOutcome(id: string, name: string, color?: string): Promise<ReturnOutcome | undefined>;
  deleteReturnOutcome(id: string): Promise<boolean>;
  reorderDropdown(table: string, ids: string[]): Promise<void>;
  getReturnDetailLogs(filingId: string): Promise<ReturnDetailLog[]>;
  addReturnDetailLog(filingId: string, fieldLabel: string, newValue: string): Promise<ReturnDetailLog>;
  getItrStatus2Options(): Promise<ItrStatus2Option[]>;
  createItrStatus2Option(name: string, role: 'caller' | 'preparer' | 'common' | 'manager', color?: string): Promise<ItrStatus2Option>;
  updateItrStatus2Option(id: string, name: string, color?: string): Promise<ItrStatus2Option | undefined>;
  deleteItrStatus2Option(id: string): Promise<boolean>;
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  getClientByPan(pan: string): Promise<Client | undefined>;
  createClient(data: InsertClient): Promise<Client>;
  updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  toggleClientStatus(id: string): Promise<Client | undefined>;
  getItrFilings(): Promise<ItrFiling[]>;
  getItrFiling(id: string): Promise<ItrFiling | undefined>;
  getItrFilingsByClientId(clientId: string): Promise<ItrFiling[]>;
  getItrFilingByClientAndFY(clientId: string, financialYear: string): Promise<ItrFiling | undefined>;
  createItrFiling(data: InsertItrFiling): Promise<ItrFiling>;
  updateItrFiling(id: string, data: Partial<InsertItrFiling>): Promise<ItrFiling | undefined>;
  deleteItrFiling(id: string): Promise<boolean>;
  getChatMessages(filingId: string): Promise<ChatMessage[]>;
  addChatMessage(filingId: string, data: { userName: string; message: string }): Promise<ChatMessage>;
  getInfoRequests(filingId: string): Promise<InfoRequest[]>;
  addInfoRequest(filingId: string, data: Omit<InfoRequest, "id" | "filingId" | "timestamp">): Promise<InfoRequest>;
  countInfoRequestsByType(type: string): Promise<number>;
  getEstimates(filingId: string): Promise<EstimateSubmission[]>;
  addEstimate(filingId: string, data: Omit<EstimateSubmission, "id" | "filingId" | "submittedAt">): Promise<EstimateSubmission>;
  getReassignments(filingId: string): Promise<ReassignmentEvent[]>;
  addReassignment(filingId: string, data: Omit<ReassignmentEvent, "id" | "filingId" | "timestamp">): Promise<ReassignmentEvent>;
  getPaymentSummary(filingId: string): Promise<PaymentSummary>;
  updatePaymentSummary(filingId: string, data: Partial<PaymentSummary>): Promise<PaymentSummary>;
  getPaymentEntries(filingId: string): Promise<PaymentEntry[]>;
  addPaymentEntry(filingId: string, data: Omit<PaymentEntry, "id" | "filingId" | "timestamp">): Promise<PaymentEntry>;
  deletePaymentEntry(filingId: string, entryId: string): Promise<boolean>;
  clearPaymentData(filingId: string): Promise<void>;
}


export class PgStorage implements IStorage {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this._seed();
  }

  private async _query(sql: string, params: any[] = []) {
    const client = await this.pool.connect();
    try { return await client.query(sql, params); }
    finally { client.release(); }
  }

  private async _seed() {
    await this._query(`
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        mobile TEXT NOT NULL,
        user_id TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        designation VARCHAR(20) NOT NULL CHECK(designation IN ('Manager','Caller','Tax Preparer')),
        status VARCHAR(10) NOT NULL DEFAULT 'Active' CHECK(status IN ('Active','Inactive')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS financial_years (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        status VARCHAR(10) NOT NULL DEFAULT 'Active' CHECK(status IN ('Active','Inactive')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS itr_statuses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS sources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS paid_tos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS mode_of_payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS itr_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS return_outcomes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        color VARCHAR(7),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`ALTER TABLE return_outcomes ADD COLUMN IF NOT EXISTS color VARCHAR(7)`);
    await this._query(`
      CREATE TABLE IF NOT EXISTS return_detail_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filing_id UUID NOT NULL,
        field_label TEXT NOT NULL,
        new_value TEXT,
        changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT '',
        mobile TEXT NOT NULL,
        alternate_mobile TEXT NOT NULL DEFAULT '',
        pan TEXT NOT NULL,
        itr_password TEXT NOT NULL DEFAULT '',
        dob TEXT NOT NULL DEFAULT '',
        aadhar_no TEXT NOT NULL DEFAULT '',
        caller TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL DEFAULT '',
        remarks TEXT NOT NULL DEFAULT '',
        status VARCHAR(10) NOT NULL DEFAULT 'Active' CHECK(status IN ('Active','Inactive')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS itr_filings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL,
        financial_year TEXT NOT NULL,
        assigned_date TEXT NOT NULL,
        preparer TEXT NOT NULL DEFAULT '',
        preparer_assigned_at TEXT,
        caller TEXT,
        filing_status TEXT NOT NULL DEFAULT 'Opened',
        status_history JSONB NOT NULL DEFAULT '[]',
        selected_income_heads JSONB NOT NULL DEFAULT '[]',
        income_data JSONB NOT NULL DEFAULT '{}',
        deductions JSONB NOT NULL DEFAULT '{"notes":"","documents":[]}',
        status2_caller TEXT,
        status2_preparer TEXT,
        manager TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS payment_summaries (
        filing_id UUID PRIMARY KEY,
        fee NUMERIC NOT NULL DEFAULT 0,
        discount NUMERIC NOT NULL DEFAULT 0,
        handled_by TEXT
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS payment_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filing_id UUID NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'payment',
        amount NUMERIC NOT NULL,
        paid_to TEXT,
        refunded_to TEXT,
        mode_of_payment TEXT,
        note TEXT,
        proof_file_name TEXT,
        proof_file_data TEXT,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filing_id UUID NOT NULL,
        user_name TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS info_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filing_id UUID NOT NULL,
        type TEXT,
        message TEXT NOT NULL,
        sender_name TEXT,
        sender_role TEXT,
        files JSONB NOT NULL DEFAULT '[]',
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS estimates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filing_id UUID NOT NULL,
        type TEXT,
        sender_name TEXT,
        sender_role TEXT,
        files JSONB NOT NULL DEFAULT '[]',
        remarks TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        prepared_at TEXT
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS reassignments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filing_id UUID NOT NULL,
        role TEXT NOT NULL,
        from_name TEXT NOT NULL,
        to_name TEXT NOT NULL,
        remarks TEXT,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      CREATE TABLE IF NOT EXISTS itr_status2_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('caller','preparer','common','manager')),
        color VARCHAR(7),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await this._query(`
      DO $$ BEGIN
        ALTER TABLE itr_status2_options DROP CONSTRAINT IF EXISTS itr_status2_options_role_check;
        ALTER TABLE itr_status2_options ADD CONSTRAINT itr_status2_options_role_check
          CHECK(role IN ('caller','preparer','common','manager'));
      EXCEPTION WHEN others THEN NULL; END $$
    `);
    await this._query(`ALTER TABLE itr_status2_options ADD COLUMN IF NOT EXISTS color VARCHAR(7)`);
    await this._query(`ALTER TABLE financial_years ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    await this._query(`ALTER TABLE itr_types ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    await this._query(`ALTER TABLE paid_tos ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    await this._query(`ALTER TABLE mode_of_payments ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    await this._query(`ALTER TABLE sources ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    await this._query(`ALTER TABLE return_outcomes ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    await this._query(`ALTER TABLE itr_status2_options ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`);
    await this._query(`ALTER TABLE itr_filings ADD COLUMN IF NOT EXISTS status2_caller TEXT`);
    await this._query(`ALTER TABLE itr_filings ADD COLUMN IF NOT EXISTS status2_preparer TEXT`);
    await this._query(`ALTER TABLE itr_filings ADD COLUMN IF NOT EXISTS manager TEXT`);
    await this._query(`ALTER TABLE itr_filings ADD COLUMN IF NOT EXISTS itr_type TEXT`);
    await this._query(`ALTER TABLE itr_filings ADD COLUMN IF NOT EXISTS filing_type TEXT`);
    await this._query(`ALTER TABLE itr_filings ADD COLUMN IF NOT EXISTS return_outcome TEXT`);

    // Seed canonical Status 2 options (only if not already seeded with colors)
    const { rows: s2Check } = await this._query(
      `SELECT id FROM itr_status2_options WHERE name='Filed' AND role='common' AND color IS NOT NULL LIMIT 1`
    );
    if (!s2Check.length) {
      await this._query(`DELETE FROM itr_status2_options`);
      const s2Seed: Array<[string, string, string]> = [
        ['Filed',                     'common',   '#22C55E'],
        ['Request More Info',         'preparer', '#F59E0B'],
        ['Submit More Info',          'caller',   '#3B82F6'],
        ['Request Revised Estimate',  'caller',   '#F59E0B'],
        ['Move to Filing',            'caller',   '#3B82F6'],
        ['Estimate Sent to Client',   'caller',   '#3B82F6'],
        ['Bank Confirmed',            'caller',   '#22C55E'],
        ['Bank Changed',              'caller',   '#F59E0B'],
        ['Not Interested',            'caller',   '#EF4444'],
        ['Not Responding',            'caller',   '#9CA3AF'],
        ['Document Pending',          'caller',   '#F59E0B'],
        ['E-Verify Later',            'common',   '#EAB308'],
        ['Estimate Prepared',         'preparer', '#22C55E'],
        ['Request Bank Confirmation', 'preparer', '#F59E0B'],
        ['Revised Estimate Prepared', 'preparer', '#22C55E'],
        ['Send JSON',                 'preparer', '#3B82F6'],
        ['Refiled',                   'common',   '#22C55E'],
        ['Filing Error',              'common',   '#EF4444'],
        ['Others',                    'common',   '#9CA3AF'],
      ];
      const { randomUUID: ru } = await import("crypto");
      for (const [name, role, color] of s2Seed) {
        await this._query(
          `INSERT INTO itr_status2_options(id,name,role,color) VALUES($1,$2,$3,$4)`,
          [ru(), name, role, color]
        );
      }
    }

    // Top-up seed: manager-specific options + escalation (idempotent)
    {
      const { randomUUID: ru } = await import("crypto");
      const topUp: Array<[string, string, string]> = [
        ['Escalate to Manager', 'caller',  '#8B5CF6'],
        ['Client Handled',      'manager', '#22C55E'],
        ['Payment Approved',    'manager', '#22C55E'],
        ['Escalation Closed',   'manager', '#64748B'],
      ];
      for (const [name, role, color] of topUp) {
        const { rows: exists } = await this._query(
          `SELECT id FROM itr_status2_options WHERE name=$1 LIMIT 1`, [name]
        );
        if (!exists.length) {
          await this._query(
            `INSERT INTO itr_status2_options(id,name,role,color) VALUES($1,$2,$3,$4)`,
            [ru(), name, role, color]
          );
        }
      }
    }

    const { rows: emp } = await this._query("SELECT id FROM employees LIMIT 1");
    if (emp.length === 0) {
      const { randomUUID } = await import("crypto");
      const employees: InsertEmployee[] = [
        { name: "Alice Johnson", email: "alice@example.com", mobile: "555-0101", userId: "alice_j", password: "pass123", designation: "Manager" },
        { name: "Bob Martinez",  email: "bob@example.com",   mobile: "555-0102", userId: "bob_m",   password: "pass123", designation: "Caller" },
        { name: "Carol Smith",   email: "carol@example.com", mobile: "555-0103", userId: "carol_s", password: "pass123", designation: "Tax Preparer" },
        { name: "David Lee",     email: "david@example.com", mobile: "555-0104", userId: "david_l", password: "pass123", designation: "Caller" },
        { name: "Eva Brown",     email: "eva@example.com",   mobile: "555-0105", userId: "eva_b",   password: "pass123", designation: "Tax Preparer" },
      ];
      for (let i = 0; i < employees.length; i++) {
        const e = employees[i];
        await this._query(
          `INSERT INTO employees(id,name,email,mobile,user_id,password,designation,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
          [randomUUID(), e.name, e.email, e.mobile, e.userId, e.password, e.designation, i === 3 ? "Inactive" : "Active"]
        );
      }
    }
    const { rows: fy } = await this._query("SELECT id FROM financial_years LIMIT 1");
    if (fy.length === 0) {
      const { randomUUID } = await import("crypto");
      for (const name of ["2022-23", "2023-24", "2024-25", "2025-26"])
        await this._query(`INSERT INTO financial_years(id,name) VALUES($1,$2)`, [randomUUID(), name]);
      for (const name of ["Interested", "Document Pending", "Under Review", "Filed", "Completed"])
        await this._query(`INSERT INTO itr_statuses(id,name) VALUES($1,$2)`, [randomUUID(), name]);
      for (const name of ["Cold Calls", "Facebook Leads", "Google Ads", "Reference", "Website", "Walk-in"])
        await this._query(`INSERT INTO sources(id,name) VALUES($1,$2)`, [randomUUID(), name]);
      for (const name of ["Venu", "Sandeep", "Evotax Axis Current account"])
        await this._query(`INSERT INTO paid_tos(id,name) VALUES($1,$2)`, [randomUUID(), name]);
      for (const name of ["Cash", "UPI", "NEFT", "RTGS", "IMPS", "Cheque", "Credit Card", "Debit Card"])
        await this._query(`INSERT INTO mode_of_payments(id,name) VALUES($1,$2)`, [randomUUID(), name]);
    }
    const { rows: itrTypeRows } = await this._query("SELECT id FROM itr_types LIMIT 1");
    if (itrTypeRows.length === 0) {
      const { randomUUID } = await import("crypto");
      for (const name of ["ITR 1", "ITR 2", "ITR 3", "ITR 4", "ITR 5", "ITR 6", "ITR 7"])
        await this._query(`INSERT INTO itr_types(id,name) VALUES($1,$2)`, [randomUUID(), name]);
    }
    const { rows: roRows } = await this._query("SELECT id FROM return_outcomes LIMIT 1");
    if (roRows.length === 0) {
      const { randomUUID } = await import("crypto");
      const roSeed: [string, string][] = [
        ["Refunded", "#22C55E"], ["Refund Pending", "#EAB308"], ["Due Paid", "#3B82F6"],
        ["Demand Raised", "#F97316"], ["Nil Return", "#9CA3AF"], ["Refund Failed", "#EF4444"],
        ["Refund Adjusted", "#8B5CF6"]
      ];
      for (const [name, color] of roSeed)
        await this._query(`INSERT INTO return_outcomes(id,name,color) VALUES($1,$2,$3)`, [randomUUID(), name, color]);
    } else {
      // Back-fill colors for existing rows that have no color set
      const roColors: Record<string, string> = {
        "Refunded": "#22C55E", "Refund Pending": "#EAB308", "Due Paid": "#3B82F6",
        "Demand Raised": "#F97316", "Nil Return": "#9CA3AF", "Refund Failed": "#EF4444",
        "Refund Adjusted": "#8B5CF6"
      };
      for (const [name, color] of Object.entries(roColors))
        await this._query(`UPDATE return_outcomes SET color=$1 WHERE name=$2 AND (color IS NULL OR color='')`, [color, name]);
    }
    const { rows: cl } = await this._query("SELECT id FROM clients LIMIT 1");
    if (cl.length === 0) {
      const { randomUUID } = await import("crypto");
      const clients: InsertClient[] = [
        { name: "Rajesh Kumar",  email: "rajesh.kumar@gmail.com",  mobile: "9810001111", alternateMobile: "",           pan: "ABCPK1234R", itrPassword: "raj@123",   dob: "1985-04-12", aadharNo: "234500012345", caller: "Alice Johnson", source: "Reference",      remarks: "Salaried employee, files every year",      status: "Active" },
        { name: "Priya Sharma",  email: "priya.sharma@yahoo.com",  mobile: "9820002222", alternateMobile: "9820003333", pan: "BCDPS5678S", itrPassword: "",           dob: "1990-08-25", aadharNo: "345600023456", caller: "Bob Martinez",  source: "Google Ads",     remarks: "Freelancer, multiple income sources",      status: "Active" },
        { name: "Ankit Mehta",   email: "ankit.mehta@outlook.com", mobile: "9830004444", alternateMobile: "",           pan: "CDEAM9012T", itrPassword: "ankit456",   dob: "1978-11-03", aadharNo: "456700034567", caller: "Alice Johnson", source: "Facebook Leads", remarks: "Business owner, GST registered",           status: "Active" },
        { name: "Sunita Patel",  email: "sunita.patel@gmail.com",  mobile: "9840005555", alternateMobile: "9840006666", pan: "DEFSP3456U", itrPassword: "",           dob: "1995-02-17", aadharNo: "567800045678", caller: "David Lee",     source: "Walk-in",        remarks: "First time filer",                         status: "Active" },
        { name: "Vikram Singh",  email: "vikram.singh@gmail.com",  mobile: "9850007777", alternateMobile: "",           pan: "EFGVS7890V", itrPassword: "vik@789",    dob: "1982-07-30", aadharNo: "678900056789", caller: "Bob Martinez",  source: "Cold Calls",     remarks: "NRI, foreign income declaration needed",   status: "Active" },
      ];
      for (const c of clients)
        await this._query(
          `INSERT INTO clients(id,name,email,mobile,alternate_mobile,pan,itr_password,dob,aadhar_no,caller,source,remarks,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [randomUUID(), c.name, c.email, c.mobile, c.alternateMobile, c.pan, c.itrPassword, c.dob, c.aadharNo, c.caller, c.source, c.remarks, c.status]
        );
    }
  }

  private _toEmployee(r: any): Employee {
    return { id: r.id, name: r.name, email: r.email, mobile: r.mobile, userId: r.user_id, password: r.password, designation: r.designation, status: r.status, createdAt: r.created_at };
  }
  private _toClient(r: any): Client {
    return { id: r.id, name: r.name, email: r.email, mobile: r.mobile, alternateMobile: r.alternate_mobile, pan: r.pan, itrPassword: r.itr_password, dob: r.dob, aadharNo: r.aadhar_no, caller: r.caller, source: r.source, remarks: r.remarks, status: r.status, createdAt: r.created_at };
  }
  private _toFiling(r: any): ItrFiling {
    return { id: r.id, clientId: r.client_id, financialYear: r.financial_year, assignedDate: r.assigned_date, preparer: r.preparer, preparerAssignedAt: r.preparer_assigned_at ?? undefined, caller: r.caller ?? undefined, filingStatus: r.filing_status, statusHistory: r.status_history ?? [], selectedIncomeHeads: r.selected_income_heads ?? [], incomeData: r.income_data ?? {}, deductions: r.deductions ?? { notes: "", documents: [] }, status2Caller: r.status2_caller ?? undefined, status2Preparer: r.status2_preparer ?? undefined, manager: r.manager ?? undefined, itrType: r.itr_type ?? undefined, filingType: r.filing_type ?? undefined, returnOutcome: r.return_outcome ?? undefined, createdAt: r.created_at };
  }
  private _toEntry(r: any): PaymentEntry {
    return { id: r.id, filingId: r.filing_id, type: r.type ?? 'payment', amount: parseFloat(r.amount), paidTo: r.paid_to ?? undefined, refundedTo: r.refunded_to ?? undefined, modeOfPayment: r.mode_of_payment ?? undefined, note: r.note ?? undefined, proofFileName: r.proof_file_name ?? undefined, proofFileData: r.proof_file_data ?? undefined, timestamp: r.timestamp };
  }

  async getEmployees() {
    const { rows } = await this._query("SELECT * FROM employees ORDER BY created_at ASC");
    return rows.map(this._toEmployee);
  }
  async getEmployee(id: string) {
    const { rows } = await this._query("SELECT * FROM employees WHERE id=$1", [id]);
    return rows[0] ? this._toEmployee(rows[0]) : undefined;
  }
  async createEmployee(emp: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    await this._query(`INSERT INTO employees(id,name,email,mobile,user_id,password,designation) VALUES($1,$2,$3,$4,$5,$6,$7)`, [id, emp.name, emp.email, emp.mobile, emp.userId, emp.password, emp.designation]);
    return (await this.getEmployee(id))!;
  }
  async updateEmployee(id: string, data: Partial<InsertEmployee>) {
    const e = await this.getEmployee(id);
    if (!e) return undefined;
    const merged = { ...e, ...data };
    await this._query(`UPDATE employees SET name=$1,email=$2,mobile=$3,user_id=$4,password=$5,designation=$6 WHERE id=$7`, [merged.name, merged.email, merged.mobile, merged.userId, merged.password, merged.designation, id]);
    return (await this.getEmployee(id))!;
  }
  async deactivateEmployee(id: string) {
    await this._query("UPDATE employees SET status='Inactive' WHERE id=$1", [id]);
    return this.getEmployee(id);
  }
  async activateEmployee(id: string) {
    await this._query("UPDATE employees SET status='Active' WHERE id=$1", [id]);
    return this.getEmployee(id);
  }
  async deleteEmployee(id: string) {
    const { rowCount } = await this._query("DELETE FROM employees WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getFinancialYears() {
    const { rows } = await this._query("SELECT * FROM financial_years ORDER BY sort_order ASC, created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, status: r.status, createdAt: r.created_at } as FinancialYear));
  }
  async createFinancialYear(name: string) {
    const id = randomUUID();
    const { rows: mx } = await this._query("SELECT COALESCE(MAX(sort_order),0) AS m FROM financial_years");
    await this._query("INSERT INTO financial_years(id,name,sort_order) VALUES($1,$2,$3)", [id, name, (mx[0].m as number) + 1]);
    const { rows } = await this._query("SELECT * FROM financial_years WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, status: rows[0].status, createdAt: rows[0].created_at } as FinancialYear;
  }
  async updateFinancialYear(id: string, name: string) {
    const { rowCount } = await this._query("UPDATE financial_years SET name=$1 WHERE id=$2", [name, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM financial_years WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, status: rows[0].status, createdAt: rows[0].created_at } as FinancialYear;
  }
  async deleteFinancialYear(id: string) {
    const { rowCount } = await this._query("DELETE FROM financial_years WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getItrStatuses() {
    const { rows } = await this._query("SELECT * FROM itr_statuses ORDER BY created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, createdAt: r.created_at } as ItrStatus));
  }
  async createItrStatus(name: string) {
    const id = randomUUID();
    await this._query("INSERT INTO itr_statuses(id,name) VALUES($1,$2)", [id, name]);
    const { rows } = await this._query("SELECT * FROM itr_statuses WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as ItrStatus;
  }
  async updateItrStatus(id: string, name: string) {
    const { rowCount } = await this._query("UPDATE itr_statuses SET name=$1 WHERE id=$2", [name, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM itr_statuses WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as ItrStatus;
  }
  async deleteItrStatus(id: string) {
    const { rowCount } = await this._query("DELETE FROM itr_statuses WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getSources() {
    const { rows } = await this._query("SELECT * FROM sources ORDER BY sort_order ASC, created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, createdAt: r.created_at } as Source));
  }
  async createSource(name: string) {
    const id = randomUUID();
    const { rows: mx } = await this._query("SELECT COALESCE(MAX(sort_order),0) AS m FROM sources");
    await this._query("INSERT INTO sources(id,name,sort_order) VALUES($1,$2,$3)", [id, name, (mx[0].m as number) + 1]);
    const { rows } = await this._query("SELECT * FROM sources WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as Source;
  }
  async updateSource(id: string, name: string) {
    const { rowCount } = await this._query("UPDATE sources SET name=$1 WHERE id=$2", [name, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM sources WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as Source;
  }
  async deleteSource(id: string) {
    const { rowCount } = await this._query("DELETE FROM sources WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getPaidTos() {
    const { rows } = await this._query("SELECT * FROM paid_tos ORDER BY sort_order ASC, created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, createdAt: r.created_at } as PaidTo));
  }
  async createPaidTo(name: string) {
    const id = randomUUID();
    const { rows: mx } = await this._query("SELECT COALESCE(MAX(sort_order),0) AS m FROM paid_tos");
    await this._query("INSERT INTO paid_tos(id,name,sort_order) VALUES($1,$2,$3)", [id, name, (mx[0].m as number) + 1]);
    const { rows } = await this._query("SELECT * FROM paid_tos WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as PaidTo;
  }
  async updatePaidTo(id: string, name: string) {
    const { rowCount } = await this._query("UPDATE paid_tos SET name=$1 WHERE id=$2", [name, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM paid_tos WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as PaidTo;
  }
  async deletePaidTo(id: string) {
    const { rowCount } = await this._query("DELETE FROM paid_tos WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getModeOfPayments() {
    const { rows } = await this._query("SELECT * FROM mode_of_payments ORDER BY sort_order ASC, created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, createdAt: r.created_at } as ModeOfPayment));
  }
  async createModeOfPayment(name: string) {
    const id = randomUUID();
    const { rows: mx } = await this._query("SELECT COALESCE(MAX(sort_order),0) AS m FROM mode_of_payments");
    await this._query("INSERT INTO mode_of_payments(id,name,sort_order) VALUES($1,$2,$3)", [id, name, (mx[0].m as number) + 1]);
    const { rows } = await this._query("SELECT * FROM mode_of_payments WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as ModeOfPayment;
  }
  async updateModeOfPayment(id: string, name: string) {
    const { rowCount } = await this._query("UPDATE mode_of_payments SET name=$1 WHERE id=$2", [name, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM mode_of_payments WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as ModeOfPayment;
  }
  async deleteModeOfPayment(id: string) {
    const { rowCount } = await this._query("DELETE FROM mode_of_payments WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getItrTypes() {
    const { rows } = await this._query("SELECT * FROM itr_types ORDER BY sort_order ASC, created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, createdAt: r.created_at } as ItrType));
  }
  async createItrType(name: string) {
    const id = randomUUID();
    const { rows: mx } = await this._query("SELECT COALESCE(MAX(sort_order),0) AS m FROM itr_types");
    await this._query("INSERT INTO itr_types(id,name,sort_order) VALUES($1,$2,$3)", [id, name, (mx[0].m as number) + 1]);
    const { rows } = await this._query("SELECT * FROM itr_types WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as ItrType;
  }
  async updateItrType(id: string, name: string) {
    const { rowCount } = await this._query("UPDATE itr_types SET name=$1 WHERE id=$2", [name, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM itr_types WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, createdAt: rows[0].created_at } as ItrType;
  }
  async deleteItrType(id: string) {
    const { rowCount } = await this._query("DELETE FROM itr_types WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getReturnOutcomes() {
    const { rows } = await this._query("SELECT * FROM return_outcomes ORDER BY sort_order ASC, created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, color: r.color ?? undefined, createdAt: r.created_at } as ReturnOutcome));
  }
  async createReturnOutcome(name: string, color?: string) {
    const id = randomUUID();
    const { rows: mx } = await this._query("SELECT COALESCE(MAX(sort_order),0) AS m FROM return_outcomes");
    await this._query("INSERT INTO return_outcomes(id,name,color,sort_order) VALUES($1,$2,$3,$4)", [id, name, color ?? null, (mx[0].m as number) + 1]);
    const { rows } = await this._query("SELECT * FROM return_outcomes WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, color: rows[0].color ?? undefined, createdAt: rows[0].created_at } as ReturnOutcome;
  }
  async updateReturnOutcome(id: string, name: string, color?: string) {
    const { rowCount } = await this._query("UPDATE return_outcomes SET name=$1,color=$2 WHERE id=$3", [name, color ?? null, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM return_outcomes WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, color: rows[0].color ?? undefined, createdAt: rows[0].created_at } as ReturnOutcome;
  }
  async deleteReturnOutcome(id: string) {
    const { rowCount } = await this._query("DELETE FROM return_outcomes WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async reorderDropdown(table: string, ids: string[]): Promise<void> {
    const allowed = ['financial_years','itr_types','paid_tos','mode_of_payments','sources','return_outcomes','itr_status2_options'];
    if (!allowed.includes(table)) throw new Error('Invalid table');
    for (let i = 0; i < ids.length; i++) {
      await this._query(`UPDATE ${table} SET sort_order=$1 WHERE id=$2`, [i, ids[i]]);
    }
  }

  async getClients() {
    const { rows } = await this._query("SELECT * FROM clients ORDER BY created_at DESC");
    return rows.map(this._toClient);
  }
  async getClient(id: string) {
    const { rows } = await this._query("SELECT * FROM clients WHERE id=$1", [id]);
    return rows[0] ? this._toClient(rows[0]) : undefined;
  }
  async getClientByPan(pan: string) {
    const { rows } = await this._query("SELECT * FROM clients WHERE UPPER(pan)=UPPER($1)", [pan]);
    return rows[0] ? this._toClient(rows[0]) : undefined;
  }
  async createClient(data: InsertClient): Promise<Client> {
    const id = randomUUID();
    await this._query(
      `INSERT INTO clients(id,name,email,mobile,alternate_mobile,pan,itr_password,dob,aadhar_no,caller,source,remarks,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [id, data.name, data.email, data.mobile, data.alternateMobile, data.pan, data.itrPassword, data.dob, data.aadharNo, data.caller, data.source, data.remarks, data.status || "Active"]
    );
    return (await this.getClient(id))!;
  }
  async updateClient(id: string, data: Partial<InsertClient>) {
    const e = await this.getClient(id);
    if (!e) return undefined;
    const m = { ...e, ...data };
    await this._query(
      `UPDATE clients SET name=$1,email=$2,mobile=$3,alternate_mobile=$4,pan=$5,itr_password=$6,dob=$7,aadhar_no=$8,caller=$9,source=$10,remarks=$11,status=$12 WHERE id=$13`,
      [m.name, m.email, m.mobile, m.alternateMobile, m.pan, m.itrPassword, m.dob, m.aadharNo, m.caller, m.source, m.remarks, m.status, id]
    );
    return (await this.getClient(id))!;
  }
  async deleteClient(id: string) {
    const { rowCount } = await this._query("DELETE FROM clients WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }
  async toggleClientStatus(id: string) {
    await this._query(`UPDATE clients SET status=CASE WHEN status='Active' THEN 'Inactive' ELSE 'Active' END WHERE id=$1`, [id]);
    return this.getClient(id);
  }

  async getItrFilings() {
    const { rows } = await this._query("SELECT * FROM itr_filings ORDER BY created_at DESC");
    return rows.map(this._toFiling);
  }
  async getItrFiling(id: string) {
    const { rows } = await this._query("SELECT * FROM itr_filings WHERE id=$1", [id]);
    return rows[0] ? this._toFiling(rows[0]) : undefined;
  }
  async getItrFilingsByClientId(clientId: string) {
    const { rows } = await this._query("SELECT * FROM itr_filings WHERE client_id=$1 ORDER BY assigned_date DESC", [clientId]);
    return rows.map(this._toFiling);
  }
  async getItrFilingByClientAndFY(clientId: string, financialYear: string) {
    const { rows } = await this._query("SELECT * FROM itr_filings WHERE client_id=$1 AND financial_year=$2", [clientId, financialYear]);
    return rows[0] ? this._toFiling(rows[0]) : undefined;
  }
  async createItrFiling(data: InsertItrFiling): Promise<ItrFiling> {
    const id = randomUUID();
    await this._query(
      `INSERT INTO itr_filings(id,client_id,financial_year,assigned_date,preparer,preparer_assigned_at,caller,filing_status,status_history,selected_income_heads,income_data,deductions) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [id, data.clientId, data.financialYear, data.assignedDate, data.preparer, data.preparerAssignedAt ?? null, data.caller ?? null, data.filingStatus, JSON.stringify(data.statusHistory), JSON.stringify(data.selectedIncomeHeads), JSON.stringify(data.incomeData), JSON.stringify(data.deductions)]
    );
    return (await this.getItrFiling(id))!;
  }
  async updateItrFiling(id: string, data: Partial<InsertItrFiling> & { status2Caller?: string; status2Preparer?: string; manager?: string; itrType?: string; filingType?: string; returnOutcome?: string }) {
    const e = await this.getItrFiling(id);
    if (!e) return undefined;
    const m = { ...e, ...data };
    await this._query(
      `UPDATE itr_filings SET client_id=$1,financial_year=$2,assigned_date=$3,preparer=$4,preparer_assigned_at=$5,caller=$6,filing_status=$7,status_history=$8,selected_income_heads=$9,income_data=$10,deductions=$11,status2_caller=$12,status2_preparer=$13,manager=$14,itr_type=$15,filing_type=$16,return_outcome=$17 WHERE id=$18`,
      [m.clientId, m.financialYear, m.assignedDate, m.preparer, m.preparerAssignedAt ?? null, m.caller ?? null, m.filingStatus, JSON.stringify(m.statusHistory), JSON.stringify(m.selectedIncomeHeads), JSON.stringify(m.incomeData), JSON.stringify(m.deductions), m.status2Caller ?? null, m.status2Preparer ?? null, m.manager ?? null, m.itrType ?? null, m.filingType ?? null, m.returnOutcome ?? null, id]
    );
    return (await this.getItrFiling(id))!;
  }
  async deleteItrFiling(id: string) {
    // Delete all related records first (no FK cascade in schema)
    await this._query("DELETE FROM payment_entries   WHERE filing_id=$1", [id]);
    await this._query("DELETE FROM payment_summaries WHERE filing_id=$1", [id]);
    await this._query("DELETE FROM chat_messages     WHERE filing_id=$1", [id]);
    await this._query("DELETE FROM info_requests     WHERE filing_id=$1", [id]);
    await this._query("DELETE FROM estimates         WHERE filing_id=$1", [id]);
    await this._query("DELETE FROM reassignments     WHERE filing_id=$1", [id]);
    const { rowCount } = await this._query("DELETE FROM itr_filings WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getChatMessages(filingId: string) {
    const { rows } = await this._query("SELECT * FROM chat_messages WHERE filing_id=$1 ORDER BY timestamp ASC", [filingId]);
    return rows.map(r => ({ id: r.id, filingId: r.filing_id, userName: r.user_name, message: r.message, timestamp: r.timestamp } as ChatMessage));
  }
  async addChatMessage(filingId: string, data: { userName: string; message: string }) {
    const id = randomUUID();
    await this._query("INSERT INTO chat_messages(id,filing_id,user_name,message) VALUES($1,$2,$3,$4)", [id, filingId, data.userName, data.message]);
    const { rows } = await this._query("SELECT * FROM chat_messages WHERE id=$1", [id]);
    return { id: rows[0].id, filingId: rows[0].filing_id, userName: rows[0].user_name, message: rows[0].message, timestamp: rows[0].timestamp } as ChatMessage;
  }

  async getInfoRequests(filingId: string) {
    const { rows } = await this._query("SELECT * FROM info_requests WHERE filing_id=$1 ORDER BY timestamp ASC", [filingId]);
    return rows.map(r => ({ id: r.id, filingId: r.filing_id, type: r.type, message: r.message, senderName: r.sender_name, senderRole: r.sender_role, files: r.files, timestamp: r.timestamp } as InfoRequest));
  }
  async addInfoRequest(filingId: string, data: Omit<InfoRequest, "id" | "filingId" | "timestamp">) {
    const id = randomUUID();
    await this._query("INSERT INTO info_requests(id,filing_id,type,message,sender_name,sender_role,files) VALUES($1,$2,$3,$4,$5,$6,$7)",
      [id, filingId, data.type ?? null, data.message, data.senderName ?? null, data.senderRole ?? null, JSON.stringify(data.files ?? [])]);
    const { rows } = await this._query("SELECT * FROM info_requests WHERE id=$1", [id]);
    return { id: rows[0].id, filingId: rows[0].filing_id, type: rows[0].type, message: rows[0].message, senderName: rows[0].sender_name, senderRole: rows[0].sender_role, files: rows[0].files, timestamp: rows[0].timestamp } as InfoRequest;
  }
  async countInfoRequestsByType(type: string): Promise<number> {
    const { rows } = await this._query("SELECT COUNT(*) AS cnt FROM info_requests WHERE type=$1", [type]);
    return parseInt(rows[0]?.cnt ?? "0", 10);
  }

  async getEstimates(filingId: string) {
    const { rows } = await this._query("SELECT * FROM estimates WHERE filing_id=$1 ORDER BY submitted_at ASC", [filingId]);
    return rows.map(r => ({ id: r.id, filingId: r.filing_id, type: r.type, senderName: r.sender_name, senderRole: r.sender_role, files: r.files, remarks: r.remarks, submittedAt: r.submitted_at, preparedAt: r.prepared_at } as EstimateSubmission));
  }
  async addEstimate(filingId: string, data: Omit<EstimateSubmission, "id" | "filingId" | "submittedAt">) {
    const id = randomUUID();
    await this._query("INSERT INTO estimates(id,filing_id,type,sender_name,sender_role,files,remarks,prepared_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
      [id, filingId, data.type ?? null, data.senderName ?? null, data.senderRole ?? null, JSON.stringify(data.files ?? []), data.remarks, data.preparedAt ?? null]);
    const { rows } = await this._query("SELECT * FROM estimates WHERE id=$1", [id]);
    return { id: rows[0].id, filingId: rows[0].filing_id, type: rows[0].type, senderName: rows[0].sender_name, senderRole: rows[0].sender_role, files: rows[0].files, remarks: rows[0].remarks, submittedAt: rows[0].submitted_at, preparedAt: rows[0].prepared_at } as EstimateSubmission;
  }

  async getReassignments(filingId: string) {
    const { rows } = await this._query("SELECT * FROM reassignments WHERE filing_id=$1 ORDER BY timestamp ASC", [filingId]);
    return rows.map(r => ({ id: r.id, filingId: r.filing_id, role: r.role, fromName: r.from_name, toName: r.to_name, remarks: r.remarks, timestamp: r.timestamp } as ReassignmentEvent));
  }
  async addReassignment(filingId: string, data: Omit<ReassignmentEvent, "id" | "filingId" | "timestamp">) {
    const id = randomUUID();
    await this._query("INSERT INTO reassignments(id,filing_id,role,from_name,to_name,remarks) VALUES($1,$2,$3,$4,$5,$6)",
      [id, filingId, data.role, data.fromName, data.toName, data.remarks ?? null]);
    const { rows } = await this._query("SELECT * FROM reassignments WHERE id=$1", [id]);
    return { id: rows[0].id, filingId: rows[0].filing_id, role: rows[0].role, fromName: rows[0].from_name, toName: rows[0].to_name, remarks: rows[0].remarks, timestamp: rows[0].timestamp } as ReassignmentEvent;
  }

  async getPaymentSummary(filingId: string): Promise<PaymentSummary> {
    const { rows } = await this._query("SELECT * FROM payment_summaries WHERE filing_id=$1", [filingId]);
    if (!rows[0]) return { fee: 0, discount: 0 };
    return { fee: parseFloat(rows[0].fee), discount: parseFloat(rows[0].discount), handledBy: rows[0].handled_by ?? undefined };
  }
  async updatePaymentSummary(filingId: string, data: Partial<PaymentSummary>): Promise<PaymentSummary> {
    const existing = await this.getPaymentSummary(filingId);
    const updated = { ...existing, ...data };
    await this._query(
      `INSERT INTO payment_summaries(filing_id,fee,discount,handled_by) VALUES($1,$2,$3,$4) ON CONFLICT(filing_id) DO UPDATE SET fee=$2,discount=$3,handled_by=$4`,
      [filingId, updated.fee, updated.discount, updated.handledBy ?? null]
    );
    return updated;
  }

  async getPaymentEntries(filingId: string): Promise<PaymentEntry[]> {
    const { rows } = await this._query("SELECT * FROM payment_entries WHERE filing_id=$1 ORDER BY timestamp ASC", [filingId]);
    return rows.map(this._toEntry);
  }
  async addPaymentEntry(filingId: string, data: Omit<PaymentEntry, "id" | "filingId" | "timestamp">): Promise<PaymentEntry> {
    const id = randomUUID();
    await this._query(
      `INSERT INTO payment_entries(id,filing_id,type,amount,paid_to,refunded_to,mode_of_payment,note,proof_file_name,proof_file_data) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, filingId, data.type ?? 'payment', data.amount, data.paidTo ?? null, data.refundedTo ?? null, data.modeOfPayment ?? null, data.note ?? null, data.proofFileName ?? null, data.proofFileData ?? null]
    );
    const { rows } = await this._query("SELECT * FROM payment_entries WHERE id=$1", [id]);
    return this._toEntry(rows[0]);
  }

  async deletePaymentEntry(filingId: string, entryId: string): Promise<boolean> {
    const { rowCount } = await this._query(
      "DELETE FROM payment_entries WHERE id=$1 AND filing_id=$2",
      [entryId, filingId]
    );
    return (rowCount ?? 0) > 0;
  }

  async clearPaymentData(filingId: string): Promise<void> {
    await this._query("DELETE FROM payment_entries WHERE filing_id=$1", [filingId]);
    await this._query("DELETE FROM payment_summaries WHERE filing_id=$1", [filingId]);
  }

  async getItrStatus2Options(): Promise<ItrStatus2Option[]> {
    const { rows } = await this._query("SELECT * FROM itr_status2_options ORDER BY sort_order ASC, created_at ASC");
    return rows.map(r => ({ id: r.id, name: r.name, role: r.role, color: r.color ?? undefined, createdAt: r.created_at } as ItrStatus2Option));
  }
  async createItrStatus2Option(name: string, role: 'caller' | 'preparer' | 'common' | 'manager', color?: string): Promise<ItrStatus2Option> {
    const id = randomUUID();
    const { rows: mx } = await this._query("SELECT COALESCE(MAX(sort_order),0) AS m FROM itr_status2_options");
    await this._query("INSERT INTO itr_status2_options(id,name,role,color,sort_order) VALUES($1,$2,$3,$4,$5)", [id, name, role, color ?? null, (mx[0].m as number) + 1]);
    const { rows } = await this._query("SELECT * FROM itr_status2_options WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, role: rows[0].role, color: rows[0].color ?? undefined, createdAt: rows[0].created_at } as ItrStatus2Option;
  }
  async updateItrStatus2Option(id: string, name: string, color?: string): Promise<ItrStatus2Option | undefined> {
    const { rowCount } = await this._query("UPDATE itr_status2_options SET name=$1, color=$2 WHERE id=$3", [name, color ?? null, id]);
    if (!rowCount) return undefined;
    const { rows } = await this._query("SELECT * FROM itr_status2_options WHERE id=$1", [id]);
    return { id: rows[0].id, name: rows[0].name, role: rows[0].role, color: rows[0].color ?? undefined, createdAt: rows[0].created_at } as ItrStatus2Option;
  }
  async deleteItrStatus2Option(id: string): Promise<boolean> {
    const { rowCount } = await this._query("DELETE FROM itr_status2_options WHERE id=$1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async getReturnDetailLogs(filingId: string): Promise<ReturnDetailLog[]> {
    const { rows } = await this._query(
      "SELECT * FROM return_detail_logs WHERE filing_id=$1 ORDER BY changed_at DESC",
      [filingId]
    );
    return rows.map(r => ({ id: r.id, filingId: r.filing_id, fieldLabel: r.field_label, newValue: r.new_value ?? '', changedAt: r.changed_at } as ReturnDetailLog));
  }
  async addReturnDetailLog(filingId: string, fieldLabel: string, newValue: string): Promise<ReturnDetailLog> {
    const { rows } = await this._query(
      "INSERT INTO return_detail_logs(id, filing_id, field_label, new_value) VALUES(gen_random_uuid(),$1,$2,$3) RETURNING *",
      [filingId, fieldLabel, newValue]
    );
    return { id: rows[0].id, filingId: rows[0].filing_id, fieldLabel: rows[0].field_label, newValue: rows[0].new_value ?? '', changedAt: rows[0].changed_at } as ReturnDetailLog;
  }
}

export const storage = new PgStorage();
