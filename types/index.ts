export interface Document {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

export interface MenuItem {
  id: string;
  title: string;
  option_number: number;
  response_text: string;
  is_main_menu: boolean;
  parent_id: string | null;
  created_at: string;
  documents?: Document[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  menuItems?: MenuItem[];
  documents?: Document[];
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

