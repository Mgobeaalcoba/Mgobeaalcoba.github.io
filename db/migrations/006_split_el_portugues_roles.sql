-- =============================================================
-- 006_split_el_portugues_roles.sql
-- Splits the single "Warehouse Supervisor / Operations Sr. Analyst"
-- entry (id=10) at El Portugues into two separate roles with the
-- full descriptions from the backup branch.
-- Run in Supabase SQL editor AFTER 005_fix_logos_and_ep_timeline.sql
-- =============================================================

-- ─── 1. Shift sort_orders for entries that come after El Portugues ──
-- This makes room for the new entry at sort_order=12
UPDATE experience SET sort_order = 14 WHERE id = 12; -- UBICAR ARGENTINA
UPDATE experience SET sort_order = 13 WHERE id = 11; -- SOLDA-LIMP S.R.L.

-- ─── 2. UPDATE id=10 → Warehouse Supervisor (more recent role) ───
UPDATE experience SET
  date_es        = 'Ene 2015 - Feb 2019',
  date_en        = 'Jan 2015 - Feb 2019',
  title_es       = 'Warehouse Supervisor',
  title_en       = 'Warehouse Supervisor',
  start_date     = '2015-01-01',
  end_date       = '2019-02-01',
  description_es = '<li>Supervisión operativa de centro logístico: Gestión integral de un warehouse de 3.500 posiciones, asegurando el correcto funcionamiento de las operaciones logísticas.</li><li>Manejo de flota de transporte: Coordinación de envíos mediante camiones propios y operadores logísticos externos (fleteros), optimizando tiempos y eficiencia.</li><li>Atención a clientes de primera línea: Gestión de operaciones logísticas para empresas líderes como Arcor, La Anónima, Los Marías, Flora-Dánica y PepsiCo.</li>',
  description_en = '<li>Operational supervision of logistics center: Comprehensive management of a 3,500-position warehouse, ensuring the correct functioning of logistics operations.</li><li>Transportation fleet management: Coordination of shipments using company-owned trucks and external logistics operators, optimizing time and efficiency.</li><li>Service to first-line clients: Management of logistics operations for leading companies such as Arcor, La Anónima, Los Marías, Flora-Dánica, and PepsiCo.</li>',
  sort_order     = 11
WHERE id = 10;

-- ─── 3. INSERT id=15 → Operations Sr. Analyst (earlier role) ────
INSERT INTO experience (
  id, date_es, date_en, title_es, title_en, company, company_logo,
  start_date, end_date, description_es, description_en, sort_order
) VALUES (
  15,
  'Feb 2011 - Dic 2014',
  'Feb 2011 - Dec 2014',
  'Operations Sr. Analyst',
  'Operations Sr. Analyst',
  'El Portugues',
  '/logos/elportugues.png',
  '2011-02-01',
  '2014-12-01',
  '<li>Coordinación de procesos clave: Supervisión de la recepción, almacenamiento, preparación y despacho de mercadería, insumos, materias primas y pañol.</li><li>Control de inventarios y operaciones: Aseguramiento del correcto registro y flujo de stock dentro del almacén, manteniendo altos estándares de orden y trazabilidad.</li><li>Gestión administrativa de proveedores logísticos: Atención y seguimiento de fleteros: liquidación de haberes, elaboración de tarifas, descuentos por repuestos y adelantos a cuenta de la compañía.</li><li>Control y conciliación de cuentas corrientes: Supervisión de gastos asociados a transporte (YPF, Rutas, telepeaje, estaciones de servicio del interior) y resolución de reclamos.</li>',
  '<li>Coordination of key processes: Supervision of the reception, storage, preparation, and dispatch of merchandise, supplies, raw materials, and tools.</li><li>Inventory and operations control: Ensuring the correct registration and flow of stock within the warehouse, maintaining high standards of order and traceability.</li><li>Administrative management of logistics providers: Attention and follow-up with freight forwarders: payment settlement, rate setting, spare parts discounts, and company advances.</li><li>Current account control and reconciliation: Supervision of transportation-related expenses (YPF, tolls, service stations) and claim resolution.</li>',
  12
);

-- ─── 4. Tags for both El Portugues roles ─────────────────────
-- id=10 (Warehouse Supervisor) already has its Excel tag from previous seed
-- Add Excel tag for the new id=15 (Operations Sr. Analyst)
INSERT INTO experience_tags (experience_id, tag) VALUES (15, 'Excel');
