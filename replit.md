# WowDash Admin Dashboard (Node.js + Express + EJS)

## Overview
WowDash is a Bootstrap 5 admin dashboard running on Express with EJS templating. It includes three fully custom modules on top of the base WowDash template.

## Architecture
- **Backend**: Express (TypeScript via `tsx`), port 5000
- **Template engine**: EJS with `express-ejs-layouts`, views in `WowDash/views/`
- **Data**: PostgreSQL via `PgStorage` in `server/storage.ts` (persists across restarts). `MemStorage` kept as fallback reference. Database tables created with raw SQL (no Drizzle ORM). `DATABASE_URL` env var required.
- **API routes**: `server/routes.ts`
- **Page routes**: `WowDash/routes/routes.js` → per-module routers
- **Frontend note**: Vite dev server runs alongside for HMR but all pages are server-rendered EJS

## Project type
- `"type": "module"` in package.json (ESM)
- WowDash CommonJS routes loaded via `createRequire` in `server/routes.ts`
- Sidebar file uses LF line endings — use Node.js scripts for sidebar edits (not sed/edit)

## Custom Modules

### 1. Clients Module (`/clients/*`)
- **Add Client** (`/clients/add-client`) — 11-field form; PAN uppercase, Caller/Source mandatory; success modal
- **View Clients** (`/clients/view-clients`) — paginated table, search, status badges, toggle Activate/Deactivate with confirmation modal, delete
- **Client Detail** (`/clients/view-client/:id`) — view/edit mode inline, status badge, deactivation confirmation modal
- API: `GET/POST /api/clients`, `GET/PUT/DELETE /api/clients/:id`, `PATCH /api/clients/:id/toggle-status`

### 2. Employee Management (`/role-and-access`)
- Manage employees with designations: Manager, Caller, Tax Preparer
- API: `GET/POST /api/employees`, `GET/PUT/DELETE /api/employees/:id`, `PATCH /api/employees/:id/activate|deactivate`

### 3. Dropdown Management (`/settings/dropdown-management`)
- Financial Years (with Active/Inactive toggle)
- ITR Statuses
- Sources
- API: `GET/POST/PUT/DELETE /api/financial-years`, `/api/itr-statuses`, `/api/sources`

### 4. Services Module (`/services/*`)

#### ITR Individual Filing (`/services/itr-individual`)
- **List page** — table with columns: Assigned Date, Client Name, PAN, Mobile, FY, Caller, Preparer, Filing Status, Actions
- **Assign Client modal** — 2-step: Step 1 = searchable active clients list, Step 2 = select FY (from Dropdown Management) + optional preparer; redirects to detail page on assign
- **Detail page** (`/services/itr-individual/:id`) — view/edit mode; shows client banner + income details (Salary, House Property, Capital Gains, Other Sources, Deductions 80C/80D, TDS, Notes)
- **Update Status** — quick status update from list page via modal
- Duplicate guard: same client + FY combination rejected with 409
- API: `GET/POST /api/itr-filings`, `GET/PUT /api/itr-filings/:id`, `PATCH /api/itr-filings/:id/status`, `DELETE /api/itr-filings/:id`

## Key Constraints
- **Designations**: Manager, Caller, Tax Preparer
- **Caller dropdown**: only employees with `designation="Caller"` AND `status="Active"`
- **Active clients only** shown in Assign Client modal
- **Financial Years** come from Dropdown Management (seeded: 2022-23 to 2025-26)
- **ITR Statuses** (seeded): Interested, Document Pending, Under Review, Filed, Completed
- UI reuses WowDash Bootstrap components — do NOT redesign

## Cleanup Notes
- Unused WowDash CSS/JS libs removed (Quill, Flatpickr, FullCalendar, Vector Map, Magnific Popup, Slick, Prism, File Upload, Audio Player)
- Only kept JS libs: jQuery, Bootstrap, ApexCharts, DataTables, Iconify, jQuery UI
- Only kept CSS libs: Bootstrap, ApexCharts, DataTables
- React client slimmed: only toast.tsx, toaster.tsx, tooltip.tsx components remain
- Unused template JS page files removed (homeTwo–homeTen, invoice, kanban, etc.)
- `extracted_dashboard/` reference folder deleted
- Unused image directories/files removed; only EJS-referenced images remain:
  favicon.png, evotax-logo.png, error-img.png, user.png, avatar/, users/,
  user-list/, flags/, notification/

## File Structure (custom files)
```
server/
  storage.ts          — all interfaces + MemStorage (includes ItrFiling)
  routes.ts           — all API endpoints

WowDash/
  routes/
    routes.js         — main router (registers clients, services)
    clients.js        — client page routes
    services.js       — services page routes
  views/
    clients/
      addClient.ejs
      viewClients.ejs
      viewClientDetail.ejs
    services/
      itrIndividualFiling.ejs
      itrFilingDetail.ejs
    partials/
      sidebar.ejs     — sidebar (CRLF/LF mixed — use Node scripts to edit)
```
