'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, X, Zap, CheckCircle, ChevronRight,
  Star, Truck, Shield, RotateCcw, CreditCard, MessageCircle,
  Heart, Share2, Tag, Search, Filter, Package, Bell
} from 'lucide-react';

// ─── Product catalog ───────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'slim-full',
    name: 'Climatizador Slim Full',
    category: 'Climatizadores',
    price: 1890,
    priceOld: 2200,
    image: '/neil-site/images/slim-full.png',
    badge: 'Más vendido',
    badgeColor: 'cyan',
    rating: 4.9,
    reviews: 142,
    stock: 8,
    description: 'El climatizador evaporativo ultra-plano de Neil con Sistema de Pre-Enfriado (Patente AR-031005B1). 12V/24V, 100% silencioso.',
    specs: ['12V / 24V', '100% Silencioso', 'Patente exclusiva', 'Anti-derrames'],
  },
  {
    id: 'master',
    name: 'Climatizador Master',
    category: 'Climatizadores',
    price: 2290,
    priceOld: 2700,
    image: '/neil-site/images/master.png',
    badge: 'Premium',
    badgeColor: 'orange',
    rating: 4.8,
    reviews: 89,
    stock: 5,
    description: 'Climatizador evaporativo de alta capacidad con pre-enfriado. Ideal para cabinas grandes de motorhome.',
    specs: ['12V / 24V', 'Alta capacidad', 'Pre-Enfriado', 'Bajo consumo'],
  },
  {
    id: 'hdk-2200',
    name: 'Aire Acondicionado HDK 2200',
    category: 'Aire Acondicionado',
    price: 3490,
    priceOld: null,
    image: '/neil-site/images/hdk-2200.png',
    badge: 'Nuevo',
    badgeColor: 'cyan',
    rating: 4.7,
    reviews: 34,
    stock: 12,
    description: 'Aire acondicionado 12V para motorhomes y camiones. Máximo confort en cualquier temperatura.',
    specs: ['12V DC', '2200 BTU', 'Bajo consumo', 'Silencioso'],
  },
  {
    id: 'hdk-2800',
    name: 'Aire Acondicionado HDK 2800',
    category: 'Aire Acondicionado',
    price: 4190,
    priceOld: null,
    image: '/neil-site/images/hdk-2800.png',
    badge: 'Nuevo',
    badgeColor: 'cyan',
    rating: 4.8,
    reviews: 21,
    stock: 6,
    description: 'Versión mejorada con mayor capacidad de enfriamiento. Ideal para climas extremos.',
    specs: ['12V / 24V', '2800 BTU', 'Eficiencia A+', 'WiFi Control'],
  },
  {
    id: 'caldera',
    name: 'Caldera Neil',
    category: 'Calderas',
    price: 2890,
    priceOld: 3200,
    image: '/neil-site/images/caldera.png',
    badge: 'Exclusivo',
    badgeColor: 'orange',
    rating: 4.9,
    reviews: 56,
    stock: 4,
    description: 'Caldera compacta de alta eficiencia para motorhomes. Agua caliente instantánea con bajo consumo de gas.',
    specs: ['Gas LPG', 'Agua instantánea', 'Compacta', 'Alta eficiencia'],
  },
  {
    id: 'genki',
    name: 'Generador Genki Solar',
    category: 'Energía & Solar',
    price: 1590,
    priceOld: null,
    image: '/neil-site/images/genki.png',
    badge: 'Sustentable',
    badgeColor: 'cyan',
    rating: 4.6,
    reviews: 47,
    stock: 15,
    description: 'Sistema de energía solar compacto para motorhomes. Autonomía sin depender de la red eléctrica.',
    specs: ['Solar 200W', 'Batería integrada', 'USB / 12V', 'MPPT'],
  },
  {
    id: 'kit-solar',
    name: 'Kit Solar Completo',
    category: 'Energía & Solar',
    price: 2190,
    priceOld: 2500,
    image: '/neil-site/images/kit-solar.png',
    badge: 'Kit completo',
    badgeColor: 'orange',
    rating: 4.7,
    reviews: 38,
    stock: 7,
    description: 'Kit solar completo listo para instalar. Incluye panel, regulador MPPT, cables y manual.',
    specs: ['400W panel', 'Regulador MPPT', 'Cables incluidos', 'Plug & Play'],
  },
  {
    id: 'carjack',
    name: 'Carjack 12V Eléctrico',
    category: 'Accesorios',
    price: 390,
    priceOld: 480,
    image: '/neil-site/images/carjack.png',
    badge: 'Oferta',
    badgeColor: 'orange',
    rating: 4.5,
    reviews: 93,
    stock: 25,
    description: 'Gata hidráulica eléctrica 12V para emergencias. Compacta, potente y de fácil uso.',
    specs: ['12V', '5T capacidad', 'Portátil', 'Con iluminación LED'],
  },
];

// ─── Automation definitions ────────────────────────────────────────────────────
type StoreAutomation = {
  title: string;
  description: string;
  icon: string;
  color: 'cyan' | 'orange';
  steps: string[];
  techStack: { name: string; role: string }[];
  benefits: string[];
};

const STORE_AUTOMATIONS: Record<string, StoreAutomation> = {
  addToCart: {
    title: 'Add to Cart → CRM + Email',
    description: 'Registra interés de producto y activa seguimiento automático',
    icon: '🛒',
    color: 'cyan',
    steps: [
      'Usuario agrega producto al carrito en la tienda',
      'Webhook n8n recibe el evento con producto, usuario y timestamp',
      'Se registra el lead en CRM (HubSpot / Pipedrive) con tag "carrito_activo"',
      'Si el carrito no se concreta en 24h → envía email de recuperación con descuento',
      'Se notifica al equipo de ventas si el valor del carrito supera $1.000 USD',
    ],
    techStack: [
      { name: 'n8n', role: 'Orquestador del flujo' },
      { name: 'HubSpot', role: 'CRM y seguimiento' },
      { name: 'Gmail / SMTP', role: 'Email de recuperación' },
      { name: 'WhatsApp API', role: 'Notificación al vendedor' },
    ],
    benefits: [
      'Recupera hasta el 30% de carritos abandonados',
      'Lead scoring automático por valor de carrito',
      'Equipo de ventas alertado en tiempo real',
      'Historial de productos de interés por cliente',
    ],
  },
  checkout: {
    title: 'Checkout → Pedido + Confirmación',
    description: 'Procesa el pedido, confirma y activa logística automáticamente',
    icon: '💳',
    color: 'cyan',
    steps: [
      'Cliente completa el pago en la tienda',
      'n8n recibe webhook de pago confirmado (Mercado Pago / Stripe)',
      'Se genera automáticamente la orden en el sistema interno (ERP)',
      'Email de confirmación con número de pedido y tracking enviado al cliente',
      'WhatsApp al depósito con detalle del producto a preparar',
      'Factura electrónica generada y adjuntada al email',
    ],
    techStack: [
      { name: 'n8n', role: 'Orquestador principal' },
      { name: 'Mercado Pago', role: 'Gateway de pago' },
      { name: 'AFIP / ARCA', role: 'Facturación electrónica' },
      { name: 'WhatsApp API', role: 'Notificación depósito' },
    ],
    benefits: [
      'Zero intervención manual en el proceso de venta',
      'Facturación automática en segundos',
      'Cliente informado en todo momento',
      'Trazabilidad completa del pedido',
    ],
  },
  whatsappOrder: {
    title: 'Consulta WhatsApp → Lead Calificado',
    description: 'Convierte consultas de WhatsApp en leads calificados automáticamente',
    icon: '💬',
    color: 'cyan',
    steps: [
      'Cliente hace clic en "Consultar por WhatsApp" desde la ficha del producto',
      'n8n registra el click con producto y datos del usuario',
      'Se pre-carga un mensaje con el producto específico consultado',
      'Al responder el vendedor, n8n registra la conversación en CRM',
      'Se activa un flujo de seguimiento si no hay respuesta en 1h',
    ],
    techStack: [
      { name: 'WhatsApp Business API', role: 'Canal de comunicación' },
      { name: 'n8n', role: 'Registro y seguimiento' },
      { name: 'HubSpot', role: 'Pipeline de ventas' },
    ],
    benefits: [
      'Contexto completo del producto al vendedor',
      'Seguimiento automático sin pérdida de leads',
      'Métricas de conversión WhatsApp → venta',
    ],
  },
  wishlist: {
    title: 'Lista de Deseos → Reenganche',
    description: 'Convierte el interés guardado en ventas futuras con alertas inteligentes',
    icon: '❤️',
    color: 'orange',
    steps: [
      'Usuario guarda un producto en su lista de deseos',
      'n8n registra el producto y la fecha',
      'Si el precio baja → notificación automática por email y WhatsApp',
      'Recordatorio a los 7, 15 y 30 días si el producto sigue en wishlist',
      'Si hay stock limitado → alerta urgente "¡Últimas unidades!"',
    ],
    techStack: [
      { name: 'n8n', role: 'Motor de reglas' },
      { name: 'Gmail', role: 'Email de alertas' },
      { name: 'WhatsApp API', role: 'Push notification' },
    ],
    benefits: [
      'Convierte intención de compra en venta real',
      'Alertas de precio personalizadas',
      'Re-engagement sin esfuerzo del equipo de ventas',
    ],
  },
  coupon: {
    title: 'Cupón de Descuento → Validación Dinámica',
    description: 'Valida cupones en tiempo real y registra su uso automáticamente',
    icon: '🏷️',
    color: 'orange',
    steps: [
      'Cliente ingresa un código de cupón en el checkout',
      'n8n consulta base de datos de cupones activos en tiempo real',
      'Valida condiciones: fecha, categoría, monto mínimo, uso único',
      'Aplica el descuento y registra el uso del cupón',
      'Reportes automáticos de efectividad de campaña',
    ],
    techStack: [
      { name: 'n8n', role: 'Validación en tiempo real' },
      { name: 'Google Sheets', role: 'Base de cupones' },
      { name: 'Webhook API', role: 'Respuesta al frontend' },
    ],
    benefits: [
      'Validación en < 500ms sin backend propio',
      'Control total de cupones desde una hoja de cálculo',
      'Prevención de uso fraudulento automática',
    ],
  },
  stockAlert: {
    title: 'Alerta de Stock → Reposición Automática',
    description: 'Gestiona el inventario y notifica reposiciones sin intervención manual',
    icon: '📦',
    color: 'orange',
    steps: [
      'Venta concretada → n8n actualiza el stock disponible',
      'Si el stock cae por debajo del mínimo → alerta al área de compras',
      'Solicitud de reposición enviada automáticamente al proveedor',
      'Clientes en lista de espera notificados cuando hay stock nuevo',
      'Dashboard de inventario actualizado en tiempo real',
    ],
    techStack: [
      { name: 'n8n', role: 'Motor de inventario' },
      { name: 'Google Sheets / Airtable', role: 'Base de datos de stock' },
      { name: 'Email / WhatsApp', role: 'Alertas multicanal' },
    ],
    benefits: [
      'Nunca más perder ventas por falta de stock',
      'Lista de espera gestionada automáticamente',
      'Reposición proactiva sin intervención humana',
    ],
  },
  productReview: {
    title: 'Post-Venta → Reseña + Soporte Proactivo',
    description: 'Activa un flujo de fidelización automático luego de cada compra',
    icon: '⭐',
    color: 'cyan',
    steps: [
      '7 días post-compra → email solicitando reseña del producto',
      'Si la reseña es ≤ 3 estrellas → alerta inmediata al equipo de soporte',
      'Si la reseña es ≥ 4 estrellas → solicitud de compartir en redes sociales',
      '30 días post-compra → oferta de accesorio complementario',
      'Se genera estadística de NPS por producto automáticamente',
    ],
    techStack: [
      { name: 'n8n', role: 'Secuencia de post-venta' },
      { name: 'Gmail', role: 'Emails automatizados' },
      { name: 'Google Forms', role: 'Recolección de reseñas' },
    ],
    benefits: [
      'NPS y reseñas generadas automáticamente',
      'Alertas de clientes insatisfechos en tiempo real',
      'Upsell post-venta sin esfuerzo del equipo',
    ],
  },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type CartItem = { product: typeof PRODUCTS[0]; qty: number };

// ─── AutomationModal component (portal-based) ─────────────────────────────────
function AutomationModal({ automation, onClose }: { automation: StoreAutomation; onClose: () => void }) {
  const isOrange = automation.color === 'orange';
  const accentClass = isOrange ? 'text-orange-400' : 'text-cyan-400';
  const bgClass = isOrange ? 'bg-orange-400/10 border-orange-400/20' : 'bg-cyan-400/10 border-cyan-400/20';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      {/* Centering wrapper — no transforms so Framer Motion doesn't interfere */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="w-full max-w-lg pointer-events-auto"
      >
        <div className="bg-[#0d1829] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 max-h-[88vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${isOrange ? 'bg-orange-400/15' : 'bg-cyan-400/15'}`}>
                {automation.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">{automation.title}</h3>
                <p className="text-slate-500 text-xs mt-0.5">n8n Webhook · Automatización activa</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 mt-0.5">
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-5">
            <p className="text-slate-400 text-sm leading-relaxed">{automation.description}</p>

            {/* Flow steps */}
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Flujo automático</p>
              <div className="space-y-2.5">
                {automation.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center ${isOrange ? 'bg-orange-400/15 border-orange-400/30' : 'bg-cyan-400/15 border-cyan-400/30'}`}>
                      <span className={`text-xs font-bold ${accentClass}`}>{i + 1}</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack */}
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Stack tecnológico</p>
              <div className="flex flex-wrap gap-2">
                {automation.techStack.map((tech) => (
                  <div key={tech.name} className={`px-3 py-1.5 rounded-lg border text-xs ${bgClass}`}>
                    <span className={`font-semibold ${accentClass}`}>{tech.name}</span>
                    <span className="text-slate-400 ml-1">· {tech.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Beneficios</p>
              <div className="space-y-2">
                {automation.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle size={14} className={`flex-shrink-0 ${accentClass}`} />
                    <p className="text-slate-300 text-sm">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs ${bgClass}`}>
              <Zap size={13} className={accentClass} />
              <span className="text-slate-400">En producción: este botón dispararía el webhook de n8n en tiempo real.</span>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </>,
    document.body
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onAddCart,
  onWishlist,
  onWhatsApp,
}: {
  product: typeof PRODUCTS[0];
  onAddCart: () => void;
  onWishlist: () => void;
  onWhatsApp: () => void;
}) {
  const [automationKey, setAutomationKey] = useState<string | null>(null);
  const discount = product.priceOld ? Math.round((1 - product.price / product.priceOld) * 100) : null;

  return (
    <>
      <AnimatePresence>
        {automationKey && (
          <AutomationModal
            automation={STORE_AUTOMATIONS[automationKey]}
            onClose={() => setAutomationKey(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4 }}
        className="bg-navy-900/60 border border-white/8 rounded-2xl overflow-hidden hover:border-cyan-accent/30 transition-all duration-300 group flex flex-col"
      >
        {/* Image */}
        <div className="relative bg-navy-800/50 p-6 flex items-center justify-center h-48">
          <img
            src={product.image}
            alt={product.name}
            className="h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold ${
            product.badgeColor === 'cyan'
              ? 'bg-cyan-accent/20 text-cyan-accent border border-cyan-accent/30'
              : 'bg-orange-400/20 text-orange-400 border border-orange-400/30'
          }`}>
            {product.badge}
          </div>
          {discount && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold">
              -{discount}%
            </div>
          )}
          {/* Wishlist */}
          <button
            onClick={() => { onWishlist(); setAutomationKey('wishlist'); }}
            className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-all"
            title="Guardar en lista de deseos"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-slate-500 text-xs mb-1">{product.category}</p>
          <h3 className="text-white font-bold text-sm mb-1 leading-snug">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={11} className={s <= Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
              ))}
            </div>
            <span className="text-slate-500 text-xs">{product.rating} ({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-white font-black text-xl">USD {product.price.toLocaleString()}</span>
            {product.priceOld && (
              <span className="text-slate-500 text-sm line-through">USD {product.priceOld.toLocaleString()}</span>
            )}
          </div>

          {/* Stock */}
          <p className={`text-xs mb-4 ${product.stock <= 5 ? 'text-orange-400' : 'text-green-400'}`}>
            {product.stock <= 5 ? `⚠ Solo ${product.stock} en stock` : `✓ Stock disponible`}
          </p>

          {/* Action buttons */}
          <div className="space-y-2 mt-auto">
            <button
              onClick={() => { onAddCart(); setAutomationKey('addToCart'); }}
              className="w-full py-2.5 rounded-xl bg-cyan-accent text-navy-950 font-bold text-sm hover:bg-cyan-light transition-all duration-200 shadow-[0_0_12px_rgba(12,193,193,0.25)] flex items-center justify-center gap-2"
            >
              <ShoppingCart size={15} />
              Agregar al carrito
            </button>
            <button
              onClick={() => { onWhatsApp(); setAutomationKey('whatsappOrder'); }}
              className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-green-400/40 hover:text-green-400 transition-all text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} />
              Consultar por WhatsApp
            </button>
          </div>

          {/* Automation hint */}
          <button
            onClick={() => setAutomationKey('addToCart')}
            className="mt-3 inline-flex items-center gap-1 text-orange-400/60 hover:text-orange-400 text-xs transition-colors"
          >
            <Zap size={11} />
            Ver automatización
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Cart Drawer ───────────────────────────────────────────────────────────────
function CartDrawer({
  items,
  onClose,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0d1829] border-l border-white/10 z-[9995] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-cyan-accent" />
            <h2 className="text-white font-bold">Tu carrito</h2>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-cyan-accent/20 text-cyan-accent text-xs font-bold">
              {items.reduce((s, i) => s + i.qty, 0)}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={40} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded-lg bg-navy-800/50 p-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                  <p className="text-slate-500 text-xs">{product.category} · x{qty}</p>
                  <p className="text-cyan-accent font-bold mt-1">USD {(product.price * qty).toLocaleString()}</p>
                </div>
                <button onClick={() => onRemove(product.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/8 space-y-3">
            {/* Coupon */}
            <CouponInput />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Total</span>
              <span className="text-white font-black text-xl">USD {total.toLocaleString()}</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3.5 rounded-xl bg-cyan-accent text-navy-950 font-black text-sm hover:bg-cyan-light transition-all shadow-[0_0_20px_rgba(12,193,193,0.3)] flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              Finalizar compra
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1"><Truck size={12} /> Envío a todo el país</div>
              <div className="flex items-center gap-1"><Shield size={12} /> Compra segura</div>
              <div className="flex items-center gap-1"><RotateCcw size={12} /> 30 días garantía</div>
            </div>
          </div>
        )}
      </motion.div>
    </>,
    document.body
  );
}

// ─── Coupon Input (with automation) ───────────────────────────────────────────
function CouponInput() {
  const [code, setCode] = useState('');
  const [showAutomation, setShowAutomation] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showAutomation && (
          <AutomationModal
            automation={STORE_AUTOMATIONS.coupon}
            onClose={() => setShowAutomation(false)}
          />
        )}
      </AnimatePresence>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <Tag size={14} className="text-slate-500" />
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Código de descuento"
            className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-slate-600"
          />
        </div>
        <button
          onClick={() => setShowAutomation(true)}
          className="px-3 py-2 rounded-xl bg-orange-400/10 border border-orange-400/30 text-orange-400 text-sm font-bold hover:bg-orange-400/20 transition-all"
        >
          Aplicar
        </button>
      </div>
    </>
  );
}

// ─── Main Store Page ──────────────────────────────────────────────────────────
const CATEGORIES = ['Todos', 'Climatizadores', 'Aire Acondicionado', 'Calderas', 'Energía & Solar', 'Accesorios'];

export default function TiendaPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [checkoutAutomation, setCheckoutAutomation] = useState(false);
  const [stockAutomation, setStockAutomation] = useState(false);
  const [reviewAutomation, setReviewAutomation] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    showToast(`✓ ${product.name} agregado al carrito`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.product.id !== id));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutAutomation(true);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCat = category === 'Todos' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-[#0B1120]">

      {/* Top notification banner */}
      <div className="bg-gradient-to-r from-orange-400/20 via-orange-400/10 to-transparent border-b border-orange-400/20 py-2 px-4">
        <p className="text-center text-orange-400 text-xs font-semibold">
          🏷️ Esta es una <strong>maqueta de tienda</strong> · Los botones simulan las automatizaciones n8n que estarían activas en producción
        </p>
      </div>

      {/* Store header */}
      <header className="sticky top-0 z-40 bg-[#0B1120]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="/neil-site/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1">
                ← Volver al sitio
              </a>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-2">
                <Package size={18} className="text-cyan-accent" />
                <span className="text-white font-bold text-lg">Neil Store</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Stock alert automation */}
              <button
                onClick={() => setStockAutomation(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-semibold hover:bg-orange-400/20 transition-all"
              >
                <Bell size={12} />
                Alertas de stock
              </button>

              {/* Review automation */}
              <button
                onClick={() => setReviewAutomation(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 text-cyan-accent text-xs font-semibold hover:bg-cyan-accent/20 transition-all"
              >
                <Star size={12} />
                Post-venta
              </button>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-accent text-navy-950 font-bold text-sm hover:bg-cyan-light transition-all shadow-[0_0_15px_rgba(12,193,193,0.3)]"
              >
                <ShoppingCart size={16} />
                <span>Carrito</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-400 text-white text-xs font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">Tienda Online</h1>
          <p className="text-slate-400">Climatizadores, aires acondicionados, calderas y energía para tu vehículo.</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-cyan-accent/40 transition-colors">
            <Search size={16} className="text-slate-500 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-500" />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-cyan-accent text-navy-950 shadow-[0_0_12px_rgba(12,193,193,0.3)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-accent/30 hover:text-white'
              }`}
            >
              {cat}
              {cat !== 'Todos' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({PRODUCTS.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Truck, label: 'Envío a todo el país', sub: 'En 3-7 días hábiles' },
            { icon: Shield, label: 'Compra 100% segura', sub: 'SSL + Pago protegido' },
            { icon: RotateCcw, label: '30 días garantía', sub: 'Devolución sin cargo' },
            { icon: MessageCircle, label: 'Soporte WhatsApp', sub: 'Lun a Vie 9–18hs' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/6">
              <div className="w-9 h-9 rounded-lg bg-cyan-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-cyan-accent" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{label}</p>
                <p className="text-slate-500 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddCart={() => addToCart(product)}
                onWishlist={() => {}}
                onWhatsApp={() => {}}
              />
            ))}
          </div>
        )}

        {/* Share button automation hint */}
        <div className="mt-12 flex items-center justify-center">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white text-sm transition-all">
            <Share2 size={14} />
            Compartir catálogo
          </button>
        </div>
      </main>

      {/* Automation popups */}
      <AnimatePresence>
        {checkoutAutomation && (
          <AutomationModal automation={STORE_AUTOMATIONS.checkout} onClose={() => setCheckoutAutomation(false)} />
        )}
        {stockAutomation && (
          <AutomationModal automation={STORE_AUTOMATIONS.stockAlert} onClose={() => setStockAutomation(false)} />
        )}
        {reviewAutomation && (
          <AutomationModal automation={STORE_AUTOMATIONS.productReview} onClose={() => setReviewAutomation(false)} />
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            items={cart}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl bg-navy-800 border border-cyan-accent/30 text-white text-sm font-semibold shadow-xl shadow-black/40 whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
