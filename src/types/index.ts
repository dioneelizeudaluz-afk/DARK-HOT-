export interface Lead {
  id: string;
  telegram_id: number;
  name: string;
  username: string | null;
  status: 'novo' | 'interessado' | 'recuperacao' | 'comprou' | 'inativo';
  last_activity: string;
  created_at: string;
}

export interface Sale {
  id: string;
  customer_name: string;
  product: string;
  amount: number;
  status: 'confirmada' | 'pendente' | 'cancelada' | 'reembolsada';
  created_at: string;
}

export interface Cashout {
  id: string;
  amount: number;
  status: 'pendente' | 'processado' | 'rejeitado';
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  text: string;
  active: boolean;
}

export interface DashboardMetrics {
  totalBotUsers: number;
  activeUsers: number;
  totalLeads: number;
  totalSales: number;
  messagesSent: number;
  conversionRate: number;
  balance: number;
  pendingCashout: number;
}

export interface BotSettings {
  bot_name: string;
  bot_username: string;
  token_configured: boolean;
}