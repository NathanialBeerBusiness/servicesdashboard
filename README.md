# ToxinResin Services Dashboard

Simple browser-based dashboard prototype for a services business automation workflow.

## Features
- Customer account management with residential/business fields (including ABN).
- Job creation linked to customers.
- Service report creation with property photo, notes, hazards, and print-to-PDF export.
- Alert draft generation for email and SMS messages.
- Invoice creation with payment instructions.

## Run locally
```bash
python3 -m http.server 4173
```
Then open `http://localhost:4173`.

> Data is currently saved in browser localStorage for demo purposes.
