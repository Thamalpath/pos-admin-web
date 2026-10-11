# OmniPOS — Admin Portal

Centralized back-office web application for the OmniPOS platform: sales analytics, inventory & product catalog management, multi-store registers and staff control.

## Structure

```
admin-web/
├── src/                         # React 18 + Vite + Tailwind + TanStack Query
│   └── ...                      # Analytics, Inventory, Registers, Products
├── packages/
│   ├── shared/                  # Domain types, Zod schemas, cart/tax calculators
│   └── ui/                      # Shared component library (Tailwind preset)
├── postcss.config.js
├── tailwind.config.js
└── vite.config.ts
```

The `packages/*` folders are local npm workspaces (`@pos/*`), consumed directly as TypeScript source — no separate build step needed.

## Getting Started

```bash
npm install

# Admin portal (http://localhost:3000)
npm run dev
```

## Build

```bash
# Production distribution -> dist/
npm run build
```

## Typecheck

```bash
npm run typecheck        # app + all @pos/* packages
```

## Requirements

- Node.js >= 20, npm >= 10
