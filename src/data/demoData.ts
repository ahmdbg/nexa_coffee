import { subDays, subHours } from 'date-fns';
import type {
  AppNotification,
  AuditLog,
  Category,
  Customer,
  Employee,
  Expense,
  Income,
  InventoryMovement,
  NexaDeskData,
  PaymentMethod,
  Product,
  Supplier,
  Transaction,
  TransactionItem,
} from '../types';
import { CURRENT_SCHEMA_VERSION } from '../constants';

const IDS = {
  business: '10000000-0000-4000-8000-000000000001',
  catCoffee: '20000000-0000-4000-8000-000000000001',
  catNonCoffee: '20000000-0000-4000-8000-000000000002',
  catFood: '20000000-0000-4000-8000-000000000003',
  catSnack: '20000000-0000-4000-8000-000000000004',
  catMerch: '20000000-0000-4000-8000-000000000005',

  supRoastery: '30000000-0000-4000-8000-000000000001',
  supDairy: '30000000-0000-4000-8000-000000000002',
  supBakery: '30000000-0000-4000-8000-000000000003',

  empOwner: '40000000-0000-4000-8000-000000000001',
  empManager: '40000000-0000-4000-8000-000000000002',
  empCashier: '40000000-0000-4000-8000-000000000003',
  empInventory: '40000000-0000-4000-8000-000000000004',

  cust1: '50000000-0000-4000-8000-000000000001',
  cust2: '50000000-0000-4000-8000-000000000002',
  cust3: '50000000-0000-4000-8000-000000000003',
  cust4: '50000000-0000-4000-8000-000000000004',
  cust5: '50000000-0000-4000-8000-000000000005',

  prodEspresso: '60000000-0000-4000-8000-000000000001',
  prodAmericano: '60000000-0000-4000-8000-000000000002',
  prodLatte: '60000000-0000-4000-8000-000000000003',
  prodCappuccino: '60000000-0000-4000-8000-000000000004',
  prodMatcha: '60000000-0000-4000-8000-000000000005',
  prodChocolate: '60000000-0000-4000-8000-000000000006',
  prodCroissant: '60000000-0000-4000-8000-000000000007',
  prodBrownie: '60000000-0000-4000-8000-000000000008',
  prodColdBrew: '60000000-0000-4000-8000-000000000009',
  prodTumbler: '60000000-0000-4000-8000-000000000010',
} as const;

export function createDemoData(referenceNow = new Date()): NexaDeskData {
  const daysAgo = (days: number, hoursOffset = 0) =>
    subHours(subDays(referenceNow, days), hoursOffset).toISOString();

  const createdBaseline = daysAgo(45);

  const categories: Category[] = [
    {
      id: IDS.catCoffee,
      name: 'Coffee',
      description: 'Espresso-based beverages and signature brewed coffees',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.catNonCoffee,
      name: 'Non-Coffee',
      description: 'Ceremonial matcha, artisan chocolate, and specialty teas',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.catFood,
      name: 'Food',
      description: 'Freshly baked viennoiserie and savory cafe plates',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.catSnack,
      name: 'Snack',
      description: 'Small-batch pastries, brownies, and counter treats',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.catMerch,
      name: 'Merchandise',
      description: 'Reusable drinkware and roasted coffee bean bags',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
  ];

  const suppliers: Supplier[] = [
    {
      id: IDS.supRoastery,
      name: 'Arabica Highlands Roastery',
      contactPerson: 'Bima Santoso',
      phone: '+1 (555) 234-8810',
      email: 'orders@arabicahighlands.example',
      address: '412 Roastery Lane, Portland, OR',
      notes: 'Single-origin espresso and cold brew bean supplier',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.supDairy,
      name: 'Meadow Dairy & Botanicals',
      contactPerson: 'Clara Lin',
      phone: '+1 (555) 391-4420',
      email: 'supply@meadowbotanicals.example',
      address: '88 Grove Avenue, Seattle, WA',
      notes: 'Oat milk, organic dairy, ceremonial matcha, and cocoa',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.supBakery,
      name: 'Artisan Bakehouse Co.',
      contactPerson: 'Julian Mercer',
      phone: '+1 (555) 618-2904',
      email: 'wholesale@artisanbakehouse.example',
      address: '19 Mill Street, Portland, OR',
      notes: 'Daily morning pastry delivery at 06:00',
      status: 'active',
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
  ];

  const employees: Employee[] = [
    {
      id: IDS.empOwner,
      name: 'Elena Vance',
      position: 'Founder & Business Owner',
      role: 'owner',
      phone: '+1 (555) 810-1001',
      email: 'elena@nexacoffee.example',
      salary: 4200,
      status: 'active',
      joinDate: daysAgo(365),
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.empManager,
      name: 'Marcus Chen',
      position: 'Store Manager',
      role: 'manager',
      phone: '+1 (555) 810-1002',
      email: 'marcus@nexacoffee.example',
      salary: 2800,
      status: 'active',
      joinDate: daysAgo(240),
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.empCashier,
      name: 'Sofia Alverez',
      position: 'Lead Barista & Cashier',
      role: 'cashier',
      phone: '+1 (555) 810-1003',
      email: 'sofia@nexacoffee.example',
      salary: 1950,
      status: 'active',
      joinDate: daysAgo(150),
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
    {
      id: IDS.empInventory,
      name: 'Daniel Park',
      position: 'Inventory Coordinator',
      role: 'inventory_staff',
      phone: '+1 (555) 810-1004',
      email: 'daniel@nexacoffee.example',
      salary: 1850,
      status: 'active',
      joinDate: daysAgo(120),
      createdAt: createdBaseline,
      updatedAt: createdBaseline,
    },
  ];

  const customers: Customer[] = [
    {
      id: IDS.cust1,
      name: 'Hannah Brooks',
      phone: '+1 (555) 402-7190',
      email: 'hannah.brooks@example.com',
      address: '214 Alder Street, Apt 4B',
      notes: 'Prefers oat milk in lattes',
      status: 'active',
      createdAt: daysAgo(40),
      updatedAt: daysAgo(1),
    },
    {
      id: IDS.cust2,
      name: 'Liam O’Connor',
      phone: '+1 (555) 402-8832',
      email: 'liam.oconnor@example.com',
      address: '78 Cedar Park Road',
      notes: 'Morning regular, orders Americano and pastry',
      status: 'active',
      createdAt: daysAgo(35),
      updatedAt: daysAgo(2),
    },
    {
      id: IDS.cust3,
      name: 'Priya Nair',
      phone: '+1 (555) 402-9914',
      email: 'priya.nair@example.com',
      address: '509 Pinehurst Ave',
      notes: 'Corporate studio orders on Fridays',
      status: 'active',
      createdAt: daysAgo(28),
      updatedAt: daysAgo(3),
    },
    {
      id: IDS.cust4,
      name: 'Noah Takahashi',
      phone: '+1 (555) 402-3319',
      email: 'noah.t@example.com',
      status: 'active',
      createdAt: daysAgo(14),
      updatedAt: daysAgo(5),
    },
    {
      id: IDS.cust5,
      name: 'Clara Hoffman',
      phone: '+1 (555) 402-5540',
      email: 'clara.h@example.com',
      status: 'active',
      createdAt: daysAgo(7),
      updatedAt: daysAgo(4),
    },
  ];

  // Initial stock definitions before movements
  const productSeeds: Array<
    Omit<Product, 'stock' | 'createdAt' | 'updatedAt'> & { initialStock: number }
  > = [
    {
      id: IDS.prodEspresso,
      sku: 'COF-001',
      name: 'Double Espresso',
      description: 'Rich double-shot extraction of house Arabica blend',
      categoryId: IDS.catCoffee,
      supplierId: IDS.supRoastery,
      costPrice: 0.95,
      sellingPrice: 3.5,
      initialStock: 95,
      minimumStock: 20,
      unit: 'cup',
      status: 'active',
    },
    {
      id: IDS.prodAmericano,
      sku: 'COF-002',
      name: 'Iced Americano',
      description: 'Double espresso poured over filtered cold water and ice',
      categoryId: IDS.catCoffee,
      supplierId: IDS.supRoastery,
      costPrice: 1.05,
      sellingPrice: 4.0,
      initialStock: 88,
      minimumStock: 20,
      unit: 'cup',
      status: 'active',
    },
    {
      id: IDS.prodLatte,
      sku: 'COF-003',
      name: 'Cafe Latte',
      description: 'Velvety micro-foam steamed milk with double espresso',
      categoryId: IDS.catCoffee,
      supplierId: IDS.supRoastery,
      costPrice: 1.45,
      sellingPrice: 4.75,
      initialStock: 80,
      minimumStock: 20,
      unit: 'cup',
      status: 'active',
    },
    {
      id: IDS.prodCappuccino,
      sku: 'COF-004',
      name: 'Cappuccino',
      description: 'Balanced espresso, steamed milk, and dense foam cap',
      categoryId: IDS.catCoffee,
      supplierId: IDS.supRoastery,
      costPrice: 1.4,
      sellingPrice: 4.5,
      initialStock: 64,
      minimumStock: 15,
      unit: 'cup',
      status: 'active',
    },
    {
      id: IDS.prodMatcha,
      sku: 'NCF-001',
      name: 'Matcha Latte',
      description: 'First-harvest Uji ceremonial matcha whisked with oat milk',
      categoryId: IDS.catNonCoffee,
      supplierId: IDS.supDairy,
      costPrice: 1.9,
      sellingPrice: 5.5,
      initialStock: 18,
      minimumStock: 15,
      unit: 'cup',
      status: 'active',
    },
    {
      id: IDS.prodChocolate,
      sku: 'NCF-002',
      name: 'Signature Dark Chocolate',
      description: '70% single-origin dark chocolate melted into steamed milk',
      categoryId: IDS.catNonCoffee,
      supplierId: IDS.supDairy,
      costPrice: 1.65,
      sellingPrice: 4.75,
      initialStock: 42,
      minimumStock: 12,
      unit: 'cup',
      status: 'active',
    },
    {
      id: IDS.prodCroissant,
      sku: 'FOD-001',
      name: 'Butter Croissant',
      description: 'Flaky French-butter laminated pastry baked fresh daily',
      categoryId: IDS.catFood,
      supplierId: IDS.supBakery,
      costPrice: 1.35,
      sellingPrice: 3.75,
      initialStock: 36,
      minimumStock: 12,
      unit: 'pcs',
      status: 'active',
    },
    {
      id: IDS.prodBrownie,
      sku: 'SNK-001',
      name: 'Espresso Fudge Brownie',
      description: 'Dense dark cocoa brownie infused with house espresso',
      categoryId: IDS.catSnack,
      supplierId: IDS.supBakery,
      costPrice: 1.25,
      sellingPrice: 3.5,
      initialStock: 14,
      minimumStock: 12,
      unit: 'pcs',
      status: 'active',
    },
    {
      id: IDS.prodColdBrew,
      sku: 'COF-005',
      name: 'Cold Brew Bottle 250ml',
      description: '18-hour slow-steeped single-origin cold brew concentrate',
      categoryId: IDS.catCoffee,
      supplierId: IDS.supRoastery,
      costPrice: 1.85,
      sellingPrice: 5.25,
      initialStock: 5,
      minimumStock: 10,
      unit: 'bottle',
      status: 'active',
    },
    {
      id: IDS.prodTumbler,
      sku: 'MRC-001',
      name: 'Nexa Ceramic Travel Tumbler',
      description: '12oz matte slate insulated ceramic coffee tumbler',
      categoryId: IDS.catMerch,
      supplierId: IDS.supRoastery,
      costPrice: 9.5,
      sellingPrice: 22.0,
      initialStock: 20,
      minimumStock: 5,
      unit: 'pcs',
      status: 'active',
    },
  ];

  // Track live stock map so movements and product stocks stay 100% synchronized
  const stockMap = new Map<string, number>();
  const inventoryMovements: InventoryMovement[] = [];
  let movementSeq = 1;
  const nextMovId = () => `70000000-0000-4000-8000-${String(movementSeq++).padStart(12, '0')}`;

  productSeeds.forEach((seed) => {
    stockMap.set(seed.id, seed.initialStock);
    inventoryMovements.push({
      id: nextMovId(),
      productId: seed.id,
      type: 'stock_in',
      quantity: seed.initialStock,
      previousStock: 0,
      newStock: seed.initialStock,
      note: 'Opening inventory stock',
      createdAt: daysAgo(30),
      createdBy: IDS.empInventory,
    });
  });

  // Build deterministic transactions and derive exact stock_out / return movements
  interface TxSeed {
    id: string;
    number: string;
    daysAgo: number;
    hoursOffset: number;
    customerId?: string;
    employeeId: string;
    paymentMethod: PaymentMethod;
    discount: number;
    taxRate: number;
    items: Array<{ productId: string; quantity: number }>;
    status: 'completed' | 'cancelled';
    cancellationReason?: string;
  }

  const txSeeds: TxSeed[] = [
    {
      id: '80000000-0000-4000-8000-000000000001',
      number: 'INV-2026-0001',
      daysAgo: 12,
      hoursOffset: 3,
      customerId: IDS.cust1,
      employeeId: IDS.empCashier,
      paymentMethod: 'card',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodLatte, quantity: 3 },
        { productId: IDS.prodCroissant, quantity: 2 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000002',
      number: 'INV-2026-0002',
      daysAgo: 10,
      hoursOffset: 2,
      customerId: IDS.cust2,
      employeeId: IDS.empCashier,
      paymentMethod: 'cash',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodAmericano, quantity: 4 },
        { productId: IDS.prodBrownie, quantity: 2 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000003',
      number: 'INV-2026-0003',
      daysAgo: 8,
      hoursOffset: 4,
      customerId: IDS.cust3,
      employeeId: IDS.empManager,
      paymentMethod: 'bank_transfer',
      discount: 5.0,
      taxRate: 10,
      items: [
        { productId: IDS.prodLatte, quantity: 6 },
        { productId: IDS.prodCappuccino, quantity: 4 },
        { productId: IDS.prodCroissant, quantity: 6 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000004',
      number: 'INV-2026-0004',
      daysAgo: 6,
      hoursOffset: 5,
      customerId: IDS.cust4,
      employeeId: IDS.empCashier,
      paymentMethod: 'e_wallet',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodMatcha, quantity: 2 },
        { productId: IDS.prodColdBrew, quantity: 2 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000005',
      number: 'INV-2026-0005',
      daysAgo: 5,
      hoursOffset: 1,
      customerId: IDS.cust1,
      employeeId: IDS.empCashier,
      paymentMethod: 'e_wallet',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodEspresso, quantity: 2 },
        { productId: IDS.prodTumbler, quantity: 1 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000006',
      number: 'INV-2026-0006',
      daysAgo: 4,
      hoursOffset: 3,
      customerId: IDS.cust5,
      employeeId: IDS.empCashier,
      paymentMethod: 'cash',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodChocolate, quantity: 2 },
        { productId: IDS.prodBrownie, quantity: 1 },
      ],
      status: 'cancelled',
      cancellationReason: 'Customer changed order to group catering invoice',
    },
    {
      id: '80000000-0000-4000-8000-000000000007',
      number: 'INV-2026-0007',
      daysAgo: 3,
      hoursOffset: 2,
      customerId: IDS.cust2,
      employeeId: IDS.empCashier,
      paymentMethod: 'card',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodAmericano, quantity: 3 },
        { productId: IDS.prodMatcha, quantity: 3 },
        { productId: IDS.prodCroissant, quantity: 3 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000008',
      number: 'INV-2026-0008',
      daysAgo: 2,
      hoursOffset: 4,
      customerId: IDS.cust3,
      employeeId: IDS.empManager,
      paymentMethod: 'bank_transfer',
      discount: 4.0,
      taxRate: 10,
      items: [
        { productId: IDS.prodLatte, quantity: 5 },
        { productId: IDS.prodColdBrew, quantity: 3 },
        { productId: IDS.prodBrownie, quantity: 3 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000009',
      number: 'INV-2026-0009',
      daysAgo: 1,
      hoursOffset: 2,
      customerId: IDS.cust1,
      employeeId: IDS.empCashier,
      paymentMethod: 'e_wallet',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodCappuccino, quantity: 3 },
        { productId: IDS.prodChocolate, quantity: 2 },
        { productId: IDS.prodCroissant, quantity: 2 },
      ],
      status: 'completed',
    },
    {
      id: '80000000-0000-4000-8000-000000000010',
      number: 'INV-2026-0010',
      daysAgo: 0,
      hoursOffset: 1,
      customerId: IDS.cust4,
      employeeId: IDS.empCashier,
      paymentMethod: 'cash',
      discount: 0,
      taxRate: 10,
      items: [
        { productId: IDS.prodEspresso, quantity: 2 },
        { productId: IDS.prodLatte, quantity: 2 },
        { productId: IDS.prodBrownie, quantity: 1 },
      ],
      status: 'completed',
    },
  ];

  const productLookup = new Map(productSeeds.map((p) => [p.id, p]));
  let itemSeq = 1;

  const transactions: Transaction[] = txSeeds.map((seed) => {
    const createdAt = daysAgo(seed.daysAgo, seed.hoursOffset);
    const items: TransactionItem[] = seed.items.map((entry) => {
      const prod = productLookup.get(entry.productId)!;
      const prev = stockMap.get(entry.productId) ?? 0;
      const next = prev - entry.quantity;
      stockMap.set(entry.productId, next);

      inventoryMovements.push({
        id: nextMovId(),
        productId: entry.productId,
        type: 'stock_out',
        quantity: entry.quantity,
        previousStock: prev,
        newStock: next,
        referenceId: seed.id,
        note: `POS sale ${seed.number}`,
        createdAt,
        createdBy: seed.employeeId,
      });

      return {
        id: `81000000-0000-4000-8000-${String(itemSeq++).padStart(12, '0')}`,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: entry.quantity,
        unitPrice: prod.sellingPrice,
        costPrice: prod.costPrice,
        subtotal: Number((prod.sellingPrice * entry.quantity).toFixed(2)),
      };
    });

    if (seed.status === 'cancelled') {
      const cancelledAt = daysAgo(seed.daysAgo, Math.max(0, seed.hoursOffset - 1));
      seed.items.forEach((entry) => {
        const prev = stockMap.get(entry.productId) ?? 0;
        const next = prev + entry.quantity;
        stockMap.set(entry.productId, next);

        inventoryMovements.push({
          id: nextMovId(),
          productId: entry.productId,
          type: 'return',
          quantity: entry.quantity,
          previousStock: prev,
          newStock: next,
          referenceId: seed.id,
          note: `Cancellation restock for ${seed.number}`,
          createdAt: cancelledAt,
          createdBy: IDS.empManager,
        });
      });
    }

    const subtotal = Number(items.reduce((s, i) => s + i.subtotal, 0).toFixed(2));
    const discount = seed.discount;
    const taxable = Math.max(0, subtotal - discount);
    const tax = Number(((taxable * seed.taxRate) / 100).toFixed(2));
    const total = Number((taxable + tax).toFixed(2));
    const paymentAmount =
      seed.paymentMethod === 'cash' ? Math.ceil(total / 5) * 5 : total;
    const changeAmount = Number((paymentAmount - total).toFixed(2));

    return {
      id: seed.id,
      transactionNumber: seed.number,
      customerId: seed.customerId,
      employeeId: seed.employeeId,
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: seed.paymentMethod,
      paymentAmount,
      changeAmount,
      status: seed.status,
      createdAt,
      ...(seed.status === 'cancelled'
        ? {
            cancelledAt: daysAgo(seed.daysAgo, Math.max(0, seed.hoursOffset - 1)),
            cancellationReason: seed.cancellationReason,
          }
        : {}),
    };
  });

  const products: Product[] = productSeeds.map((seed) => {
    const { initialStock: _unused, ...rest } = seed;
    return {
      ...rest,
      stock: stockMap.get(seed.id) ?? 0,
      createdAt: createdBaseline,
      updatedAt: daysAgo(0),
    };
  });

  const expenses: Expense[] = [
    {
      id: '90000000-0000-4000-8000-000000000001',
      category: 'Ingredients',
      description: 'Arabica single-origin beans & oat milk restock',
      amount: 115.0,
      date: daysAgo(11),
      paymentMethod: 'bank_transfer',
      notes: 'Invoice #AH-904',
      createdAt: daysAgo(11),
      updatedAt: daysAgo(11),
    },
    {
      id: '90000000-0000-4000-8000-000000000002',
      category: 'Electricity',
      description: 'Monthly cafe utility & espresso boiler power',
      amount: 48.5,
      date: daysAgo(7),
      paymentMethod: 'bank_transfer',
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
    {
      id: '90000000-0000-4000-8000-000000000003',
      category: 'Marketing',
      description: 'Seasonal autumn menu window signage',
      amount: 32.0,
      date: daysAgo(3),
      paymentMethod: 'card',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  ];

  const income: Income[] = [
    {
      id: '91000000-0000-4000-8000-000000000001',
      category: 'Workshop & Training',
      description: 'Weekend pour-over coffee tasting session (6 guests)',
      amount: 120.0,
      date: daysAgo(4),
      paymentMethod: 'bank_transfer',
      notes: 'Non-POS workshop revenue',
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },
  ];

  const notifications: AppNotification[] = [
    {
      id: '92000000-0000-4000-8000-000000000001',
      title: 'Out of Stock Alert',
      message: 'Cold Brew Bottle 250ml has reached 0 units in stock.',
      type: 'danger',
      read: false,
      link: '/app/inventory',
      createdAt: daysAgo(2),
    },
    {
      id: '92000000-0000-4000-8000-000000000002',
      title: 'Low Stock Threshold Reached',
      message: 'Espresso Fudge Brownie is down to 8 pcs (minimum: 12 pcs).',
      type: 'warning',
      read: false,
      link: '/app/inventory',
      createdAt: daysAgo(0, 1),
    },
    {
      id: '92000000-0000-4000-8000-000000000003',
      title: 'Workspace Initialized',
      message: 'Nexa Coffee House local-first dataset loaded cleanly.',
      type: 'info',
      read: true,
      link: '/app/dashboard',
      createdAt: daysAgo(0, 2),
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: '93000000-0000-4000-8000-000000000001',
      action: 'TRANSACTION_COMPLETED',
      entityType: 'transaction',
      entityId: '80000000-0000-4000-8000-000000000010',
      actorId: IDS.empCashier,
      actorName: 'Sofia Alverez',
      summary: 'Completed POS transaction INV-2026-0010',
      createdAt: daysAgo(0, 1),
    },
    {
      id: '93000000-0000-4000-8000-000000000002',
      action: 'TRANSACTION_CANCELLED',
      entityType: 'transaction',
      entityId: '80000000-0000-4000-8000-000000000006',
      actorId: IDS.empManager,
      actorName: 'Marcus Chen',
      summary: 'Cancelled INV-2026-0006 and restored product stock',
      createdAt: daysAgo(4, 2),
    },
  ];

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    business: {
      id: IDS.business,
      name: 'Nexa Coffee House',
      category: 'Coffee Shop & Bakery',
      description: 'Specialty espresso bar, ceremonial matcha, and artisan pastries.',
      address: '245 Hawthorne Blvd, Portland, OR 97214',
      phone: '+1 (555) 742-9000',
      email: 'hello@nexacoffee.example',
      currency: 'USD',
      createdAt: createdBaseline,
      updatedAt: daysAgo(0),
    },
    settings: {
      language: 'en',
      theme: 'light',
      dateFormat: 'dd/MM/yyyy',
      currency: 'USD',
      taxEnabled: true,
      taxRate: 10,
      lowStockAlertEnabled: true,
      notificationsEnabled: true,
    },
    products,
    categories,
    suppliers,
    inventoryMovements,
    transactions,
    customers,
    employees,
    expenses,
    income,
    notifications,
    auditLogs,
  };
}
