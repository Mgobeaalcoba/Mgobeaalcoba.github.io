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
  const referenceDate = new Date("2026-08-18T12:00:00.000Z");

  for (let i = 0; i < count; i++) {
    const date = new Date(referenceDate);
    date.setUTCDate(date.getUTCDate() - ((i * 7) % 30));
    date.setUTCHours((i * 11) % 24, (i * 17) % 60);

    const intent = intents[i % intents.length];
    const sentiment = sentiments[(i * 5 + 1) % sentiments.length];
    const conversion =
      (intent === "consultancy" && i % 5 < 2) ||
      (intent === "ai_tech" && i % 7 < 2) ||
      (intent === "career" && i % 19 === 0);

    sessions.push({
      id: `sess-${i}`,
      timestamp: date.toISOString(),
      messages: ((i * 3) % 8) + 2,
      intent,
      sentiment,
      conversion,
      responseTime: ((i * 2) % 5) + 1,
    });
  }

  return sessions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const MOCK_DASHBOARD_DATA = generateMockSessions(120);

export const getAggregatedKpis = (sessions: DashboardSession[]) => {
  const totalMessages = sessions.reduce((acc, s) => acc + s.messages, 0);
  const totalLeads = sessions.filter(s => s.conversion).length;
  const avgResponseTime = sessions.length > 0
    ? sessions.reduce((acc, s) => acc + s.responseTime, 0) / sessions.length
    : 0;
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
