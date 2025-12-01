export interface MenuItem {
  id: string;
  title: string;
  option_number: number;
  response_text: string;
  is_main_menu: boolean;
  parent_id: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  menuItems?: MenuItem[];
}

export interface ChatResponse {
  success: boolean;
  response: string;
  menuItems?: MenuItem[];
  timestamp: string;
  error?: string;
  parentMenuId?: string | null;
  menuContext?: {
    currentParentId: string;
    currentParentTitle: string;
    hierarchyLevel: number;
    path: string[];
  };
}

export interface MenuResponse {
  success: boolean;
  menuItems: MenuItem[];
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  version: string;
}

