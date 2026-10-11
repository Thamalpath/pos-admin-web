import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Receipt,
  MonitorSmartphone,
  Plus,
  Search,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';
import { Button, Input, Badge, Card, Modal, Drawer, ThemeToggle } from '@pos/ui';
import { Product, formatAmount, CURRENCY_LABEL } from '@pos/shared';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Inventory & Catalog', icon: Package },
  { id: 'orders', label: 'Orders & Receipts', icon: Receipt },
  { id: 'terminals', label: 'POS Registers & Sync', icon: MonitorSmartphone }
] as const;

type NavId = (typeof NAV_ITEMS)[number]['id'];

const PAGE_TITLES: Record<NavId, string> = {
  dashboard: 'Business Intelligence Dashboard',
  products: 'Inventory & Catalog',
  orders: 'Orders & Receipts',
  terminals: 'POS Registers & Sync'
};

// Initial admin mock data
const INITIAL_ADMIN_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'BEV-001',
    barcode: '8901001',
    name: 'Espresso Double Shot',
    categoryId: 'cat-bev',
    categoryName: 'Beverages',
    price: 3.5,
    costPrice: 0.65,
    taxRatePercent: 8,
    stockQuantity: 99,
    trackInventory: false,
    isActive: true
  },
  {
    id: 'prod-002',
    sku: 'BEV-002',
    barcode: '8901002',
    name: 'Vanilla Oat Milk Latte',
    categoryId: 'cat-bev',
    categoryName: 'Beverages',
    price: 4.75,
    costPrice: 1.1,
    taxRatePercent: 8,
    stockQuantity: 45,
    trackInventory: true,
    isActive: true
  },
  {
    id: 'prod-003',
    sku: 'BAK-001',
    barcode: '8901003',
    name: 'Almond Butter Croissant',
    categoryId: 'cat-bakery',
    categoryName: 'Bakery',
    price: 3.95,
    costPrice: 0.9,
    taxRatePercent: 5,
    stockQuantity: 14,
    trackInventory: true,
    isActive: true
  },
  {
    id: 'prod-007',
    sku: 'RET-001',
    barcode: '8901007',
    name: 'Ceramic KeepCup (12oz)',
    categoryId: 'cat-merch',
    categoryName: 'Retail & Merch',
    price: 22.0,
    costPrice: 8.5,
    taxRatePercent: 10,
    stockQuantity: 12,
    trackInventory: true,
    isActive: true
  }
];

const Kpis = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
    <Card>
      <div className="flex items-center justify-between text-fg-muted text-xs font-medium">
        <span>Today&apos;s Gross Sales</span>
        <DollarSign className="w-4 h-4 text-brand-fg shrink-0" />
      </div>
      <div className="text-2xl font-black text-fg mt-2 tabular">$2,845.50</div>
      <div className="flex items-center gap-1 text-xs text-success-fg mt-2">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        <span>+18.4% vs yesterday</span>
      </div>
    </Card>

    <Card>
      <div className="flex items-center justify-between text-fg-muted text-xs font-medium">
        <span>Transactions</span>
        <ShoppingBag className="w-4 h-4 text-info-fg shrink-0" />
      </div>
      <div className="text-2xl font-black text-fg mt-2 tabular">184</div>
      <div className="text-xs text-fg-muted mt-2">Avg ticket: $15.46</div>
    </Card>

    <Card>
      <div className="flex items-center justify-between text-fg-muted text-xs font-medium">
        <span>Active Terminals</span>
        <MonitorSmartphone className="w-4 h-4 text-accent-fg shrink-0" />
      </div>
      <div className="text-2xl font-black text-fg mt-2">3 Online</div>
      <div className="text-xs text-success-fg mt-2">Tauri &amp; Web sync healthy</div>
    </Card>

    <Card>
      <div className="flex items-center justify-between text-fg-muted text-xs font-medium">
        <span>Low Stock Alert</span>
        <AlertTriangle className="w-4 h-4 text-warning-fg shrink-0" />
      </div>
      <div className="text-2xl font-black text-fg mt-2">2 Items</div>
      <div className="text-xs text-warning-fg mt-2">Needs reordering soon</div>
    </Card>
  </div>
);

const RecentTransactions = () => (
  <Card flush>
    <div className="p-4 sm:p-5 pb-0">
      <h3 className="text-sm font-semibold text-fg">Recent Multi-terminal Transactions</h3>
    </div>
    <div className="overflow-x-auto scrollbar-gutter-stable">
      <table className="w-full text-xs text-left min-w-[680px]">
        <thead className="text-fg-muted border-b border-line">
          <tr>
            <th scope="col" className="p-3.5 font-medium">Order ID</th>
            <th scope="col" className="p-3.5 font-medium">Terminal</th>
            <th scope="col" className="p-3.5 font-medium">Cashier</th>
            <th scope="col" className="p-3.5 font-medium">Items</th>
            <th scope="col" className="p-3.5 font-medium">Total</th>
            <th scope="col" className="p-3.5 font-medium">Sync Source</th>
            <th scope="col" className="p-3.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-fg-muted">
          <tr className="hover:bg-surface-2 transition-colors">
            <td className="p-3.5 font-mono font-medium text-brand-fg">#ORD-90281</td>
            <td className="p-3.5 whitespace-nowrap">Tauri POS 01 (Desktop)</td>
            <td className="p-3.5 whitespace-nowrap">John Doe</td>
            <td className="p-3.5">3 items</td>
            <td className="p-3.5 font-semibold text-fg tabular">$24.50</td>
            <td className="p-3.5"><Badge variant="info">SQLite &rarr; Postgres</Badge></td>
            <td className="p-3.5"><Badge variant="success">Completed</Badge></td>
          </tr>
          <tr className="hover:bg-surface-2 transition-colors">
            <td className="p-3.5 font-mono font-medium text-brand-fg">#ORD-90280</td>
            <td className="p-3.5 whitespace-nowrap">Tablet Web POS 02</td>
            <td className="p-3.5 whitespace-nowrap">Sarah Connor</td>
            <td className="p-3.5">1 item</td>
            <td className="p-3.5 font-semibold text-fg tabular">$4.75</td>
            <td className="p-3.5"><Badge variant="info">Web IDB &rarr; Postgres</Badge></td>
            <td className="p-3.5"><Badge variant="success">Completed</Badge></td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
);

const TerminalCard: React.FC<{
  title: string;
  badge: React.ReactNode;
  lines: string[];
}> = ({ title, badge, lines }) => (
  <Card>
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <h4 className="font-semibold text-sm text-fg">{title}</h4>
      {badge}
    </div>
    <div className="text-xs space-y-1.5 text-fg-muted">
      {lines.map(line => (
        <p key={line}>{line}</p>
      ))}
    </div>
  </Card>
);

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavId>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_ADMIN_PRODUCTS);
  const [searchFilter, setSearchFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('General');
  const [newProdPrice, setNewProdPrice] = useState('9.99');
  const [newProdStock, setNewProdStock] = useState('50');

  // Selecting a destination closes the mobile drawer.
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: newProdName,
      sku: newProdSku || `SKU-${Date.now().toString().slice(-4)}`,
      barcode: newProdBarcode || undefined,
      categoryId: 'cat-custom',
      categoryName: newProdCategory,
      price: parseFloat(newProdPrice) || 0,
      taxRatePercent: 8,
      stockQuantity: parseInt(newProdStock) || 0,
      trackInventory: true,
      isActive: true
    };
    setProducts([created, ...products]);
    setIsAddModalOpen(false);
    setNewProdName('');
    setNewProdSku('');
    setNewProdBarcode('');
  };

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const sidebarContent = (
    <>
      <div className="p-4 sm:p-6 border-b border-line flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center font-black text-fg-on-brand border border-brand-line shrink-0">
          OP
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-sm tracking-tight text-fg truncate">OmniPOS Admin</h2>
          <span className="text-[11px] text-brand-fg font-medium block truncate">
            Headquarters BackOffice
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="ml-auto lg:hidden p-2 -mr-2 rounded-lg text-fg-muted hover:bg-surface-3 hover:text-fg transition"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                isActive
                  ? 'bg-brand-soft text-brand-fg border border-brand-line'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-3 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-line flex items-center justify-between gap-2 mt-auto">
        <div className="min-w-0">
          <div className="font-medium text-fg text-xs truncate">Admin Supervisor</div>
          <div className="text-[11px] text-fg-subtle truncate">admin@omnipos.cloud</div>
        </div>
        <Badge variant="success" className="shrink-0">Online</Badge>
      </div>
    </>
  );

  return (
    <div className="flex h-full bg-canvas text-fg">
      {/* Sidebar: docked from lg, off-canvas drawer below it */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-surface border-r border-line flex-col shrink-0">
        {sidebarContent}
      </aside>

      {isSidebarOpen && (
        <Drawer
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          side="left"
          widthClassName="w-72 max-w-[85vw]"
          ariaLabel="Main navigation"
        >
          <div className="flex flex-col h-full bg-surface">{sidebarContent}</div>
        </Drawer>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 sm:h-16 border-b border-line px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 bg-surface/80 backdrop-blur shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-fg-muted hover:bg-surface-3 hover:text-fg transition shrink-0"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-fg truncate">
              {PAGE_TITLES[activeTab]}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden md:inline text-xs text-fg-muted whitespace-nowrap">
              Cloud Sync: Active (PostgreSQL)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping shrink-0" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <Kpis />
              <RecentTransactions />
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 sm:max-w-sm">
                  <Input
                    placeholder="Search catalog by name or SKU..."
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                    aria-label="Search catalog"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => setIsAddModalOpen(true)}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Button>
              </div>

              <Card flush className="overflow-hidden">
                <div className="overflow-x-auto scrollbar-gutter-stable">
                  <table className="w-full text-xs text-left min-w-[760px]">
                    <thead className="bg-surface-2 text-fg-muted border-b border-line">
                      <tr>
                        <th scope="col" className="p-3.5 font-medium">Product Name</th>
                        <th scope="col" className="p-3.5 font-medium">SKU</th>
                        <th scope="col" className="p-3.5 font-medium">Barcode</th>
                        <th scope="col" className="p-3.5 font-medium">Category</th>
                        <th scope="col" className="p-3.5 font-medium">Price ({CURRENCY_LABEL})</th>
                        <th scope="col" className="p-3.5 font-medium">Stock</th>
                        <th scope="col" className="p-3.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-fg-muted">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-fg-subtle">
                            No products match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-surface-2 transition-colors">
                            <td className="p-3.5 font-semibold text-fg">{p.name}</td>
                            <td className="p-3.5 font-mono text-fg-subtle">{p.sku}</td>
                            <td className="p-3.5 font-mono text-fg-subtle">{p.barcode || '—'}</td>
                            <td className="p-3.5"><Badge variant="neutral">{p.categoryName}</Badge></td>
                            <td className="p-3.5 font-bold text-brand-fg tabular">{formatAmount(p.price)}</td>
                            <td className="p-3.5">
                              <span className={p.stockQuantity <= 5 ? 'text-warning-fg font-bold' : ''}>
                                {p.stockQuantity} in stock
                              </span>
                            </td>
                            <td className="p-3.5">
                              <Badge variant={p.isActive ? 'success' : 'danger'}>
                                {p.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-4 sm:p-6 lg:p-8 space-y-4">
              <h3 className="text-sm font-semibold text-fg">Centralized Cloud Sales Ledger</h3>
              <Card className="text-center text-fg-muted text-xs">
                <Receipt className="w-10 h-10 mx-auto mb-2 opacity-50 text-brand-fg" />
                <p>Connected to PostgreSQL Order Database.</p>
                <p className="mt-1">
                  Real-time sync streaming active via ASP.NET Core SignalR / WebSockets.
                </p>
              </Card>
            </div>
          )}

          {activeTab === 'terminals' && (
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TerminalCard
                  title="Terminal #01 (Front Counter)"
                  badge={<Badge variant="success">Online • Tauri Desktop</Badge>}
                  lines={[
                    'Runtime: Tauri 2.0 (Windows x64 Native)',
                    'Hardware: Epson TM-T88VI (USB Raw ESC/POS)',
                    'Offline Database: Local SQLite (pos_offline.db)',
                    'Pending Sync Queue: 0 items'
                  ]}
                />
                <TerminalCard
                  title="Terminal #02 (Mobile Patio)"
                  badge={<Badge variant="info">Online • Web POS</Badge>}
                  lines={[
                    'Runtime: Web Browser / iPad Safari',
                    'Hardware: Browser Web Print / Bluetooth ESC/POS',
                    'Offline Database: IndexedDB (Dexie)',
                    'Pending Sync Queue: 0 items'
                  ]}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div>
            <label className="text-xs text-fg-muted block mb-1.5" htmlFor="prod-name">
              Product Title
            </label>
            <Input
              id="prod-name"
              value={newProdName}
              onChange={e => setNewProdName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-fg-muted block mb-1.5" htmlFor="prod-sku">
                SKU Code
              </label>
              <Input
                id="prod-sku"
                value={newProdSku}
                onChange={e => setNewProdSku(e.target.value)}
                placeholder="Auto or manual"
              />
            </div>
            <div>
              <label className="text-xs text-fg-muted block mb-1.5" htmlFor="prod-barcode">
                Barcode
              </label>
              <Input
                id="prod-barcode"
                value={newProdBarcode}
                onChange={e => setNewProdBarcode(e.target.value)}
                placeholder="EAN/UPC"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-fg-muted block mb-1.5" htmlFor="prod-category">
                Category
              </label>
              <Input
                id="prod-category"
                value={newProdCategory}
                onChange={e => setNewProdCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-fg-muted block mb-1.5" htmlFor="prod-price">
                Price ($)
              </label>
              <Input
                id="prod-price"
                type="number"
                step="0.01"
                inputMode="decimal"
                value={newProdPrice}
                onChange={e => setNewProdPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-fg-muted block mb-1.5" htmlFor="prod-stock">
                Stock
              </label>
              <Input
                id="prod-stock"
                type="number"
                inputMode="numeric"
                value={newProdStock}
                onChange={e => setNewProdStock(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};