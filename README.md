# ToxinResin Services Dashboard

Simple browser-based dashboard prototype for a services business automation workflow.

## Features
- Separate pages for Customer Accounts, Jobs, Service Reports, and Invoices.
- Customer account management with residential/business fields (including ABN).
- Job creation linked to customers.
- Service Report creation with property photo, notes, hazards, and completion timestamp.
- Service Report PDF export that prints **only the report content**.
- Delete actions for customers, jobs, service reports, invoices, and communication history.
- SMS/Email send form on the Service Reports page:
  - opens your device/app via `mailto:` (email) or `sms:` (text)
  - saves sent message history locally in the dashboard.
- Alert draft generation for email and SMS messages.
- Invoice creation with payment instructions.

## Pages
- `customers.html`
- `jobs.html`
- `service-reports.html`
- `invoices.html`

## Run locally
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173`.

> Data is currently saved in browser localStorage for demo purposes.
