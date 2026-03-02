"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Database,
  Mail,
  MessageSquare,
  Bot,
  Zap,
  ArrowRight,
  Plus,
  Trash2,
  Info,
  Layers,
  Webhook,
  ClipboardList,
  Clock,
  CreditCard,
  Instagram,
  Code,
  FileSearch,
  BookOpen,
  FileCode,
  Briefcase,
  Mic,
  FileSpreadsheet,
} from "lucide-react";
import * as gtag from "@/lib/gtag";

type NodeType = "source" | "processor" | "destination";

interface NodeDef {
  id: string;
  type: NodeType;
  label: string;
  icon: any;
  color: string;
  description: string;
}

const AVAILABLE_NODES: NodeDef[] = [
  // Sources (Disparadores)
  {
    id: "whatsapp",
    type: "source",
    label: "WhatsApp",
    icon: MessageSquare,
    color: "#25D366",
    description: "Entrada de mensajes de clientes.",
  },
  {
    id: "email",
    type: "source",
    label: "Email",
    icon: Mail,
    color: "#EA4335",
    description: "Correos electrónicos entrantes.",
  },
  {
    id: "webhook",
    type: "source",
    label: "Webhook",
    icon: Webhook,
    color: "#818cf8",
    description: "Señal de otro sistema (ERP/CRM).",
  },
  {
    id: "form",
    type: "source",
    label: "Formulario",
    icon: ClipboardList,
    color: "#fa6423",
    description: "Entrada via Typeform / Tally.",
  },
  {
    id: "schedule",
    type: "source",
    label: "Programado",
    icon: Clock,
    color: "#64748b",
    description: "Ejecución regular (Cron).",
  },
  {
    id: "stripe",
    type: "source",
    label: "Stripe",
    icon: CreditCard,
    color: "#635bff",
    description: "Disparo por pagos o suscripciones.",
  },
  {
    id: "social",
    type: "source",
    label: "Redes Soc.",
    icon: Instagram,
    color: "#E1306C",
    description: "Instagram / Facebook.",
  },

  // Processors (Procesamiento)
  {
    id: "llm",
    type: "processor",
    label: "IA (LLM)",
    icon: Bot,
    color: "#38bdf8",
    description: "Análisis y generación de respuesta.",
  },
  {
    id: "logic",
    type: "processor",
    label: "Lógica",
    icon: Zap,
    color: "#facc15",
    description: "Clasificación y validación.",
  },
  {
    id: "code",
    type: "processor",
    label: "Código",
    icon: Code,
    color: "#f59e0b",
    description: "Scripts JS/Python personalizados.",
  },
  {
    id: "ocr",
    type: "processor",
    label: "OCR/Vision",
    icon: FileSearch,
    color: "#8b5cf6",
    description: "Análisis de imágenes y PDFs.",
  },
  {
    id: "rag",
    type: "processor",
    label: "Knowledge",
    icon: BookOpen,
    color: "#10b981",
    description: "Consulta a base de conocimientos.",
  },
  {
    id: "format",
    type: "processor",
    label: "Formateador",
    icon: FileCode,
    color: "#ec4899",
    description: "Transformación JSON/XML/CSV.",
  },

  // Destinations (Destinos)
  {
    id: "supabase",
    type: "destination",
    label: "Database",
    icon: Database,
    color: "#3ecf8e",
    description: "Almacenamiento persistente.",
  },
  {
    id: "hubspot",
    type: "destination",
    label: "CRM",
    icon: Briefcase,
    color: "#ff7a59",
    description: "Actualización de HubSpot / Salesforce.",
  },
  {
    id: "voice",
    type: "destination",
    label: "Voz IA",
    icon: Mic,
    color: "#0ea5e9",
    description: "Llamada o respuesta de voz.",
  },
  {
    id: "sheets",
    type: "destination",
    label: "Spreadsheet",
    icon: FileSpreadsheet,
    color: "#0F9D58",
    description: "Escritura en Google Sheets.",
  },
  {
    id: "notify",
    type: "destination",
    label: "Slack/Aviso",
    icon: Zap,
    color: "#fb7185",
    description: "Notificación al equipo.",
  },
];

export default function ArchVisualizer() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const addNode = (id: string) => {
    setSelectedNodes((prev) => [...prev, id]);
    gtag.events.archVisualizerAddNode(id);
  };

  const removeNode = (index: number) => {
    setSelectedNodes((prev) => prev.filter((_, i) => i !== index));
  };

  const clearArch = () => {
    setSelectedNodes([]);
    gtag.events.archVisualizerClear();
  };

  const architectureInfo = useMemo(() => {
    if (selectedNodes.length === 0) return null;

    const hasSource = selectedNodes.some(
      (id) => AVAILABLE_NODES.find((n) => n.id === id)?.type === "source"
    );
    const hasProcessor = selectedNodes.some(
      (id) => AVAILABLE_NODES.find((n) => n.id === id)?.type === "processor"
    );
    const hasDest = selectedNodes.some(
      (id) => AVAILABLE_NODES.find((n) => n.id === id)?.type === "destination"
    );

    let explanation = "";
    if (!hasSource)
      explanation = "Agrega un disparador (Source) para comenzar.";
    else if (!hasProcessor && !hasDest)
      explanation = "Conecta un procesador de IA o un destino.";
    else if (hasSource && hasProcessor && hasDest)
      explanation =
        "¡Arquitectura completa! Este flujo automatiza la captura, el análisis con IA y la persistencia de datos sin intervención humana.";
    else
      explanation =
        "Tu flujo está tomando forma. Sigue agregando componentes para completar la solución.";

    return { explanation, isComplete: hasSource && hasProcessor && hasDest };
  }, [selectedNodes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      {/* Sidebar: Available Components */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass p-6 rounded-2xl border-sky-500/20">
          <h3 className="text-xl font-bold mb-4 text-sky-400 flex items-center gap-2">
            <Layers size={20} />
            Componentes
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Selecciona componentes para construir tu arquitectura automatizada.
          </p>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {(["source", "processor", "destination"] as NodeType[]).map(
              (type) => (
                <div key={type} className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    {type === "source"
                      ? "Disparadores"
                      : type === "processor"
                        ? "Procesamiento"
                        : "Destinos"}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {AVAILABLE_NODES.filter((n) => n.type === type).map(
                      (node) => (
                        <button
                          key={node.id}
                          onClick={() => addNode(node.id)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 hover:bg-gray-800/80 border border-white/5 hover:border-sky-500/30 transition-all group text-left"
                        >
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor: `${node.color}20`,
                              color: node.color,
                            }}
                          >
                            <node.icon size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {node.label}
                            </div>
                            <div className="text-[10px] text-gray-400 hidden group-hover:block italic">
                              {node.description}
                            </div>
                          </div>
                          <Plus
                            size={14}
                            className="ml-auto text-gray-600 group-hover:text-sky-400 transition-colors"
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas: Architecture Flow */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-8 rounded-3xl border-white/10 min-h-[400px] flex flex-col relative overflow-hidden">
          {/* Decorative Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-lg font-bold text-gray-300">
              Tu Flujo de Automatización
            </h3>
            {selectedNodes.length > 0 && (
              <button
                onClick={clearArch}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={14} /> Limpiar
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-12 relative z-10">
            <AnimatePresence>
              {selectedNodes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 text-center italic py-20"
                >
                  <Share2 className="mx-auto mb-4 opacity-20" size={48} />
                  El lienzo está vacío. Selecciona un componente para empezar.
                </motion.div>
              ) : (
                selectedNodes.map((nodeId, index) => {
                  const node = AVAILABLE_NODES.find((n) => n.id === nodeId);
                  if (!node) return null;

                  return (
                    <div
                      key={`${nodeId}-${index}`}
                      className="flex items-center gap-4"
                    >
                      {index > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-sky-500/50"
                        >
                          <ArrowRight size={20} />
                        </motion.div>
                      )}
                      <motion.div
                        layout
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative group"
                      >
                        <div
                          className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all shadow-xl"
                          style={{
                            backgroundColor: `${node.color}10`,
                            borderColor: `${node.color}40`,
                            color: node.color,
                            boxShadow: `0 0 20px ${node.color}10`,
                          }}
                        >
                          <node.icon size={28} />
                          <span className="text-[10px] font-bold text-white text-center px-1">
                            {node.label}
                          </span>
                        </div>
                        <button
                          onClick={() => removeNode(index)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    </div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Explanation Footer */}
          {architectureInfo && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`mt-auto p-4 rounded-xl border flex items-start gap-4 transition-colors z-10 ${
                architectureInfo.isComplete
                  ? "bg-sky-500/10 border-sky-500/30"
                  : "bg-gray-800/50 border-white/5"
              }`}
            >
              <div
                className={
                  architectureInfo.isComplete ? "text-sky-400" : "text-gray-400"
                }
              >
                <Info size={20} />
              </div>
              <p className="text-sm leading-relaxed text-gray-200">
                {architectureInfo.explanation}
              </p>
            </motion.div>
          )}
        </div>

        {/* Benefits Quote */}
        <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-6 rounded-2xl border border-white/5 flex items-center gap-6">
          <div className="hidden sm:block p-4 bg-white/5 rounded-full">
            <Zap className="text-yellow-400" size={32} />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">
              Impacto de la Automatización
            </h4>
            <p className="text-sm text-gray-400 italic">
              "Una arquitectura bien diseñada puede ahorrar hasta un 80% del
              tiempo operativo en tareas repetitivas de gestión de clientes y
              datos."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
