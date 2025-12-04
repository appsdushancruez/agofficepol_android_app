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
    jobNumberHint: string;
  };
}

export const translations: Record<Language, Translations> = {
  si: {
    welcome: {
      badge: 'AI චැට්බොට් සේවාව',
      titlePart1: 'WhatsApp',
      titlePart2: 'Bot',
      titlePart3: 'Admin',
      titlePart4: 'System',
      description: 'විවිධ සේවා සපයා WhatsApp හරහා අප හා සම්බන්ධ වන්න. වැදගත් තොරතුරු, ලේඛන, අනුමැතිය සහ රැකියා තත්ත්ව යාවත්කාලීන කිරීම් ලබා ගන්න.',
      chatButton: 'බොට් සමඟ සංවාදය',
      liveStatus: 'සජීවී සහ ක්‍රියාකාරී',
      selectLanguage: 'භාෂාව තෝරන්න',
    },
    chat: {
      headerTitle: 'චැට් බොට්',
      emptyMessage: '"හායි" හෝ "කොහොමද" යැවීමෙන් සංවාදයක් ආරම්භ කරන්න',
      jobNumberHint: 'රැකියාවක් හෝ කාර්යයක තත්ත්වය පරීක්ෂා කරනු ලබයි',
    },
  },
  en: {
    welcome: {
      badge: 'AI Chat Bot Service',
      titlePart1: 'WhatsApp',
      titlePart2: 'Bot',
      titlePart3: 'Admin',
      titlePart4: 'System',
      description: 'Connect with us via WhatsApp to access various services. Get important information, documents, approvals, and job status updates.',
      chatButton: 'Chat with Bot',
      liveStatus: 'Live & Active',
      selectLanguage: 'Select Language',
    },
    chat: {
      headerTitle: 'Chat Bot',
      emptyMessage: 'Start a conversation by sending "hi" or "hello"',
      jobNumberHint: 'Checking job or task status',
    },
  },
};

