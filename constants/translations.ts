export type Language = 'si' | 'en';

export interface Translations {
  welcome: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    titlePart3: string;
    titlePart4: string;
    description: string;
    chatButton: string;
    liveStatus: string;
    selectLanguage: string;
  };
  chat: {
    headerTitle: string;
    emptyMessage: string;
  };
}

export const translations: Record<Language, Translations> = {
  si: {
    welcome: {
      badge: 'පොල්ගහවෙල ප්‍රාදේශීය ලේකම් කාර්යාලය',
      titlePart1: 'WhatsApp',
      titlePart2: 'Bot',
      titlePart3: 'Admin',
      titlePart4: 'System',
      description: 'විවිධ සේවා සපයා රජයේ සේවා සැපයීම සඳහා WhatsApp හරහා අප හා සම්බන්ධ වන්න. වැදගත් තොරතුරු, ලේඛන, අනුමැතිය සහ රැකියා තත්ත්ව යාවත්කාලීන කිරීම් ලබා ගන්න.',
      chatButton: 'බොට් සමඟ සංවාදය',
      liveStatus: 'සජීවී සහ ක්‍රියාකාරී',
      selectLanguage: 'භාෂාව තෝරන්න',
    },
    chat: {
      headerTitle: 'චැට් බොට්',
      emptyMessage: '"හායි" හෝ "කොහොමද" යැවීමෙන් සංවාදයක් ආරම්භ කරන්න',
    },
  },
  en: {
    welcome: {
      badge: 'Polgahawela Divisional Secretariat Office',
      titlePart1: 'WhatsApp',
      titlePart2: 'Bot',
      titlePart3: 'Admin',
      titlePart4: 'System',
      description: 'Connect with us via WhatsApp to serve the public with various services. Get important information, documents, approvals, and job status updates.',
      chatButton: 'Chat with Bot',
      liveStatus: 'Live & Active',
      selectLanguage: 'Select Language',
    },
    chat: {
      headerTitle: 'Chat Bot',
      emptyMessage: 'Start a conversation by sending "hi" or "hello"',
    },
  },
};

