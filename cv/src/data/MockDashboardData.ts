export interface DashboardSession {
  id: string;
  timestamp: string;
  messages: number;
  intent: "consultancy" | "ai_tech" | "career" | "general";
  sentiment: "positive" | "neutral" | "negative";
  conversion: boolean;
  responseTime: number; // in seconds
}

export const generateMockSessions = (count: number): DashboardSession[] => {
  const intents: DashboardSession["intent"][] = ["consultancy", "ai_tech", "career", "general"];
  const sentiments: DashboardSession["sentiment"][] = ["positive", "neutral", "negative"];
  
  const sessions: DashboardSession[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    // Spread data over the last 30 days
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    const intent = intents[Math.floor(Math.random() * intents.length)];
    const sentimentWeight = Math.random();
    const sentiment = sentimentWeight > 0.6 ? "positive" : sentimentWeight > 0.2 ? "neutral" : "negative";
    
    // Higher conversion probability for consultancy and ai_tech intents
    const conversionProb = intent === "consultancy" ? 0.4 : intent === "ai_tech" ? 0.3 : 0.05;
    const conversion = Math.random() < conversionProb;

    sessions.push({
      id: `sess-${i}`,
      timestamp: date.toISOString(),
      messages: Math.floor(Math.random() * 8) + 2,
      intent,
      sentiment,
      conversion,
      responseTime: Math.floor(Math.random() * 5) + 1, // Fast AI response
    });
  }

  return sessions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const MOCK_DASHBOARD_DATA = generateMockSessions(120);

export const getAggregatedKpis = (sessions: DashboardSession[]) => {
  const totalMessages = sessions.reduce((acc, s) => acc + s.messages, 0);
  const totalLeads = sessions.filter(s => s.conversion).length;
  const avgResponseTime = sessions.reduce((acc, s) => acc + s.responseTime, 0) / sessions.length;
  const hoursSaved = (totalMessages * 5) / 60; // Assume 5 mins saved per message vs human

  return {
    totalSessions: sessions.length,
    totalMessages,
    totalLeads,
    avgResponseTime: avgResponseTime.toFixed(1),
    hoursSaved: Math.round(hoursSaved),
    conversionRate: sessions.length > 0 ? ((totalLeads / sessions.length) * 100).toFixed(1) : 0,
  };
};

export const formatSupabaseData = (dbRows: any[]): DashboardSession[] => {
  return dbRows.map(row => ({
    id: row.id,
    timestamp: row.created_at,
    messages: 1, // Row based logging assumes 1 interaction per log for now
    intent: row.intent || "general",
    sentiment: row.sentiment || "neutral",
    conversion: row.conversion || false,
    responseTime: row.response_time || 2,
  }));
};
