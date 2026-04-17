// Realistic seed data for 2MP Industry SPA — Chlef (production) & Blida (sales).

export type MOStatus = "Draft" | "In Production" | "Quality Check" | "Completed" | "Cancelled";
export type Site = "Chlef" | "Blida";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  site: Site | "Both";
  initials: string;
}

export const users: User[] = [
  { id: "u1", name: "Karim Bensalem",  email: "k.bensalem@2mp.dz",  role: "Production Manager",  site: "Chlef", initials: "KB" },
  { id: "u2", name: "Yacine Haddad",   email: "y.haddad@2mp.dz",    role: "Warehouse Operator",  site: "Chlef", initials: "YH" },
  { id: "u3", name: "Amina Cherif",    email: "a.cherif@2mp.dz",    role: "Sales Representative",site: "Blida", initials: "AC" },
  { id: "u4", name: "Sofiane Mansouri",email: "s.mansouri@2mp.dz",  role: "After-Sales Technician", site: "Both", initials: "SM" },
  { id: "u5", name: "Nadia Belkacem",  email: "n.belkacem@2mp.dz",  role: "Executive / CEO",     site: "Both", initials: "NB" },
];

export const currentUser = users[0];

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: Site;
  status: "active" | "maintenance" | "idle";
  lastMaintenance: string;
}

export const machines: Machine[] = [
  { id: "M-01", name: "CNC Plasma A1",  type: "CNC Plasma 1530",      location: "Chlef", status: "active",      lastMaintenance: "2026-03-12" },
  { id: "M-02", name: "CNC Plasma A2",  type: "CNC Plasma 2040",      location: "Chlef", status: "active",      lastMaintenance: "2026-02-28" },
  { id: "M-03", name: "Plieuse Hydra",  type: "Hydraulic Press Brake",location: "Chlef", status: "maintenance", lastMaintenance: "2026-04-10" },
  { id: "M-04", name: "Soudure MIG-1",  type: "MIG Welding Station",  location: "Chlef", status: "active",      lastMaintenance: "2026-03-30" },
  { id: "M-05", name: "Imprimante 3D X",type: "FDM 3D Printer",       location: "Chlef", status: "idle",        lastMaintenance: "2026-01-22" },
];

export interface ManufacturingOrder {
  id: string;
  reference: string;
  product: string;
  sku: string;
  qtyOrdered: number;
  qtyProduced: number;
  status: MOStatus;
  machineId: string;
  operatorId: string;
  startedAt: string | null;
  targetDate: string;
  completedAt: string | null;
  clientOrderId?: string;
  notes?: string;
}

export const manufacturingOrders: ManufacturingOrder[] = [
  { id: "mo1", reference: "OF-2026-087", product: "Poste à souder MIG 250A",       sku: "WLD-MIG-250", qtyOrdered: 12, qtyProduced: 8,  status: "In Production", machineId: "M-04", operatorId: "u1", startedAt: "2026-04-08", targetDate: "2026-04-14", completedAt: null, clientOrderId: "co1", notes: "Client : Sonatrach — priorité haute" },
  { id: "mo2", reference: "OF-2026-091", product: "Machine de découpe CNC 1530",   sku: "CNC-PLA-1530", qtyOrdered: 3, qtyProduced: 2,  status: "In Production", machineId: "M-01", operatorId: "u1", startedAt: "2026-04-10", targetDate: "2026-04-15", completedAt: null, clientOrderId: "co2" },
  { id: "mo3", reference: "OF-2026-095", product: "Transpalette lourd 3T",         sku: "TRP-HD-3T",   qtyOrdered: 20, qtyProduced: 14, status: "In Production", machineId: "M-03", operatorId: "u1", startedAt: "2026-04-05", targetDate: "2026-04-12", completedAt: null, clientOrderId: "co3", notes: "En retard — pliage en attente" },
  { id: "mo4", reference: "OF-2026-098", product: "Imprimante 3D industrielle",    sku: "PRT-3D-IND",  qtyOrdered: 5,  qtyProduced: 5,  status: "Quality Check", machineId: "M-05", operatorId: "u1", startedAt: "2026-04-02", targetDate: "2026-04-13", completedAt: null },
  { id: "mo5", reference: "OF-2026-101", product: "Machine de découpe CNC 2040",   sku: "CNC-PLA-2040", qtyOrdered: 2, qtyProduced: 2,  status: "Completed",     machineId: "M-02", operatorId: "u1", startedAt: "2026-03-28", targetDate: "2026-04-10", completedAt: "2026-04-09" },
  { id: "mo6", reference: "OF-2026-104", product: "Poste à souder TIG 200A",       sku: "WLD-TIG-200", qtyOrdered: 8,  qtyProduced: 0,  status: "Draft",         machineId: "M-04", operatorId: "u1", startedAt: null,        targetDate: "2026-04-22", completedAt: null },
];

export interface StockItem {
  id: string;
  reference: string;
  name: string;
  category: "Raw Material" | "Spare Part" | "WIP" | "Finished Good";
  unit: string;
  qtyChlef: number;
  qtyBlida: number;
  minThreshold: number;
  supplier: string;
  leadTimeDays: number;
}

export const stockItems: StockItem[] = [
  { id: "s1",  reference: "RM-STL-2MM",   name: "Tôle acier 2mm (1500x3000)",  category: "Raw Material",  unit: "feuille", qtyChlef: 142, qtyBlida: 0,  minThreshold: 50,  supplier: "Alfasid Annaba",      leadTimeDays: 14 },
  { id: "s2",  reference: "RM-STL-4MM",   name: "Tôle acier 4mm (1500x3000)",  category: "Raw Material",  unit: "feuille", qtyChlef: 38,  qtyBlida: 0,  minThreshold: 40,  supplier: "Alfasid Annaba",      leadTimeDays: 14 },
  { id: "s3",  reference: "RM-INX-1MM",   name: "Tôle inox 1mm",               category: "Raw Material",  unit: "feuille", qtyChlef: 22,  qtyBlida: 0,  minThreshold: 25,  supplier: "Imetal Algiers",      leadTimeDays: 21 },
  { id: "s4",  reference: "RM-WIRE-MIG",  name: "Fil de soudure MIG 1.2mm",    category: "Raw Material",  unit: "kg",      qtyChlef: 320, qtyBlida: 0,  minThreshold: 100, supplier: "ESAB France",         leadTimeDays: 30 },
  { id: "s5",  reference: "SP-NOZ-PLA",   name: "Buse plasma 105A",            category: "Spare Part",    unit: "unité",   qtyChlef: 18,  qtyBlida: 4,  minThreshold: 12,  supplier: "Hypertherm",          leadTimeDays: 45 },
  { id: "s6",  reference: "SP-MOT-SRV",   name: "Servo-moteur 400W",           category: "Spare Part",    unit: "unité",   qtyChlef: 6,   qtyBlida: 2,  minThreshold: 8,   supplier: "Yaskawa",             leadTimeDays: 60 },
  { id: "s7",  reference: "FG-WLD-MIG250",name: "Poste à souder MIG 250A",     category: "Finished Good", unit: "unité",   qtyChlef: 4,   qtyBlida: 7,  minThreshold: 3,   supplier: "—",                   leadTimeDays: 0  },
  { id: "s8",  reference: "FG-CNC-1530",  name: "Machine CNC 1530",            category: "Finished Good", unit: "unité",   qtyChlef: 1,   qtyBlida: 2,  minThreshold: 2,   supplier: "—",                   leadTimeDays: 0  },
  { id: "s9",  reference: "FG-TRP-3T",    name: "Transpalette lourd 3T",       category: "Finished Good", unit: "unité",   qtyChlef: 6,   qtyBlida: 9,  minThreshold: 5,   supplier: "—",                   leadTimeDays: 0  },
  { id: "s10", reference: "FG-PRT-3D",    name: "Imprimante 3D industrielle",  category: "Finished Good", unit: "unité",   qtyChlef: 0,   qtyBlida: 3,  minThreshold: 2,   supplier: "—",                   leadTimeDays: 0  },
  { id: "s11", reference: "RM-GAS-AR",    name: "Bouteille Argon 50L",         category: "Raw Material",  unit: "bouteille",qtyChlef: 28, qtyBlida: 0,  minThreshold: 10,  supplier: "Linde Gaz Algérie",   leadTimeDays: 7  },
  { id: "s12", reference: "SP-LAS-FIB",   name: "Source laser fibre 1500W",    category: "Spare Part",    unit: "unité",   qtyChlef: 2,   qtyBlida: 0,  minThreshold: 1,   supplier: "Raycus",              leadTimeDays: 75 },
];

export interface StockMovement {
  id: string;
  itemId: string;
  type: "Incoming" | "Production Consumption" | "Transfer" | "Sale" | "Scrap";
  quantity: number;
  site: Site;
  user: string;
  timestamp: string;
  reason?: string;
}

export const stockMovements: StockMovement[] = [
  { id: "mv1", itemId: "s1", type: "Production Consumption", quantity: -12, site: "Chlef", user: "Yacine Haddad", timestamp: "2026-04-15 09:42", reason: "OF-2026-091" },
  { id: "mv2", itemId: "s7", type: "Transfer",               quantity: -3,  site: "Chlef", user: "Yacine Haddad", timestamp: "2026-04-15 11:10", reason: "TR-2026-022 → Blida" },
  { id: "mv3", itemId: "s4", type: "Incoming",               quantity: +200,site: "Chlef", user: "Yacine Haddad", timestamp: "2026-04-14 14:25", reason: "Livraison ESAB" },
  { id: "mv4", itemId: "s9", type: "Sale",                   quantity: -2,  site: "Blida", user: "Amina Cherif",  timestamp: "2026-04-14 10:05", reason: "CMD-2026-058" },
  { id: "mv5", itemId: "s2", type: "Scrap",                  quantity: -1,  site: "Chlef", user: "Karim Bensalem",timestamp: "2026-04-13 16:50", reason: "Défaut découpe" },
];

export interface TransferRequest {
  id: string;
  reference: string;
  itemId: string;
  quantity: number;
  status: "Requested" | "Confirmed" | "In Transit" | "Received";
  requestedBy: string;
  requestedAt: string;
  expectedAt: string;
}

export const transferRequests: TransferRequest[] = [
  { id: "tr1", reference: "TR-2026-022", itemId: "s7", quantity: 3, status: "In Transit", requestedBy: "Amina Cherif", requestedAt: "2026-04-13", expectedAt: "2026-04-16" },
  { id: "tr2", reference: "TR-2026-023", itemId: "s9", quantity: 2, status: "Requested",  requestedBy: "Amina Cherif", requestedAt: "2026-04-15", expectedAt: "2026-04-18" },
  { id: "tr3", reference: "TR-2026-021", itemId: "s8", quantity: 1, status: "Received",   requestedBy: "Amina Cherif", requestedAt: "2026-04-09", expectedAt: "2026-04-12" },
  { id: "tr4", reference: "TR-2026-024", itemId: "s10",quantity: 1, status: "Confirmed",  requestedBy: "Amina Cherif", requestedAt: "2026-04-15", expectedAt: "2026-04-17" },
];

export interface Client {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  wilaya: string;
  sector: string;
  type: "Privé" | "Institution publique";
  rep: string;
}

export const clients: Client[] = [
  { id: "c1", company: "Sonatrach DP",        contact: "M. Belkadi Rachid", phone: "+213 555 12 34 56", email: "r.belkadi@sonatrach.dz", wilaya: "Hassi Messaoud", sector: "Énergie",      type: "Institution publique", rep: "Amina Cherif" },
  { id: "c2", company: "Cevital Industries",   contact: "Mme. Yasmina Ould",  phone: "+213 770 88 22 11", email: "y.ould@cevital.dz",      wilaya: "Béjaïa",         sector: "Agroalimentaire", type: "Privé",                rep: "Amina Cherif" },
  { id: "c3", company: "ENIE Sidi Bel Abbès",  contact: "M. Karim Mahdi",     phone: "+213 661 45 78 99", email: "k.mahdi@enie.dz",        wilaya: "Sidi Bel Abbès", sector: "Électronique",    type: "Institution publique", rep: "Amina Cherif" },
  { id: "c4", company: "SARL MetalPro Blida",  contact: "M. Hocine Brahimi",  phone: "+213 555 33 44 22", email: "h.brahimi@metalpro.dz",  wilaya: "Blida",          sector: "Métallurgie",     type: "Privé",                rep: "Amina Cherif" },
  { id: "c5", company: "Cosider Construction", contact: "Mme. Lila Benali",   phone: "+213 770 11 99 88", email: "l.benali@cosider.dz",    wilaya: "Alger",          sector: "BTP",             type: "Institution publique", rep: "Amina Cherif" },
];

export interface CommercialOrder {
  id: string;
  reference: string;
  clientId: string;
  products: { name: string; qty: number; unitPrice: number }[];
  totalDZD: number;
  deliveryDate: string;
  stage:
    | "Lead"
    | "Quote Sent"
    | "Order Confirmed"
    | "In Production"
    | "Ready to Ship"
    | "Delivered"
    | "Invoiced";
  paymentTerms: string;
  linkedMO?: string;
}

export const commercialOrders: CommercialOrder[] = [
  { id: "co1", reference: "CMD-2026-061", clientId: "c1", products: [{ name: "Poste à souder MIG 250A", qty: 12, unitPrice: 285000 }],          totalDZD: 3420000, deliveryDate: "2026-04-18", stage: "In Production",   paymentTerms: "30 jours", linkedMO: "OF-2026-087" },
  { id: "co2", reference: "CMD-2026-062", clientId: "c2", products: [{ name: "Machine CNC 1530",        qty: 3,  unitPrice: 1850000 }],         totalDZD: 5550000, deliveryDate: "2026-04-20", stage: "In Production",   paymentTerms: "50% acompte", linkedMO: "OF-2026-091" },
  { id: "co3", reference: "CMD-2026-063", clientId: "c5", products: [{ name: "Transpalette lourd 3T",   qty: 20, unitPrice: 195000 }],          totalDZD: 3900000, deliveryDate: "2026-04-17", stage: "In Production",   paymentTerms: "60 jours (public)", linkedMO: "OF-2026-095" },
  { id: "co4", reference: "CMD-2026-058", clientId: "c4", products: [{ name: "Transpalette lourd 3T",   qty: 2,  unitPrice: 195000 }],          totalDZD: 390000,  deliveryDate: "2026-04-14", stage: "Delivered",       paymentTerms: "Comptant" },
  { id: "co5", reference: "CMD-2026-064", clientId: "c3", products: [{ name: "Imprimante 3D industrielle", qty: 2, unitPrice: 720000 }],        totalDZD: 1440000, deliveryDate: "2026-04-25", stage: "Quote Sent",      paymentTerms: "30 jours" },
  { id: "co6", reference: "CMD-2026-065", clientId: "c2", products: [{ name: "Poste à souder TIG 200A", qty: 4,  unitPrice: 245000 }],          totalDZD: 980000,  deliveryDate: "2026-04-30", stage: "Order Confirmed", paymentTerms: "30 jours" },
  { id: "co7", reference: "CMD-2026-060", clientId: "c1", products: [{ name: "Machine CNC 2040",        qty: 1,  unitPrice: 2400000 }],         totalDZD: 2400000, deliveryDate: "2026-04-10", stage: "Invoiced",        paymentTerms: "60 jours (public)" },
  { id: "co8", reference: "CMD-2026-066", clientId: "c5", products: [{ name: "Machine CNC 1530",        qty: 2,  unitPrice: 1850000 }],         totalDZD: 3700000, deliveryDate: "2026-05-02", stage: "Lead",            paymentTerms: "À définir" },
  { id: "co9", reference: "CMD-2026-059", clientId: "c4", products: [{ name: "Poste à souder MIG 250A", qty: 5,  unitPrice: 285000 }],          totalDZD: 1425000, deliveryDate: "2026-04-16", stage: "Ready to Ship",   paymentTerms: "Comptant" },
];

export interface ServiceTicket {
  id: string;
  reference: string;
  clientId: string;
  product: string;
  serial: string;
  type: "Panne" | "Garantie" | "Pièces détachées" | "Calibration";
  description: string;
  priority: "Basse" | "Moyenne" | "Haute" | "Critique";
  status: "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  technician: string;
  site: string;
  openedAt: string;
}

export const serviceTickets: ServiceTicket[] = [
  { id: "st1", reference: "TKT-2026-014", clientId: "c2", product: "Machine CNC 1530",      serial: "CNC1530-2025-018", type: "Panne",            description: "Erreur axe Y, arrêt en cours d'usinage", priority: "Haute",   status: "In Progress", technician: "Sofiane Mansouri", site: "Béjaïa",   openedAt: "2026-04-14" },
  { id: "st2", reference: "TKT-2026-015", clientId: "c1", product: "Poste à souder MIG 250A", serial: "WLDMIG-2025-042", type: "Garantie",         description: "Faiblesse de l'arc, à inspecter",         priority: "Moyenne", status: "Assigned",    technician: "Sofiane Mansouri", site: "Hassi Messaoud", openedAt: "2026-04-15" },
  { id: "st3", reference: "TKT-2026-013", clientId: "c4", product: "Transpalette lourd 3T", serial: "TRP3T-2024-099",   type: "Pièces détachées", description: "Demande roues polyuréthane",            priority: "Basse",   status: "Open",        technician: "—",                site: "Blida",    openedAt: "2026-04-15" },
  { id: "st4", reference: "TKT-2026-012", clientId: "c5", product: "Machine CNC 2040",      serial: "CNC2040-2024-007", type: "Calibration",      description: "Calibration annuelle programmée",        priority: "Moyenne", status: "Resolved",    technician: "Sofiane Mansouri", site: "Alger",    openedAt: "2026-04-10" },
  { id: "st5", reference: "TKT-2026-011", clientId: "c3", product: "Imprimante 3D industrielle", serial: "PRT3D-2024-021", type: "Panne",          description: "Buse bouchée, extrudeur HS",             priority: "Critique",status: "In Progress", technician: "Sofiane Mansouri", site: "Sidi Bel Abbès", openedAt: "2026-04-12" },
];

export const formatDZD = (n: number) =>
  new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(n) + " DA";
