import { Send, Mail } from 'lucide-react';
import { ActionConfig } from './types';

export const actionConfigs: Record<string, ActionConfig> = {
  telegram: {
    icon: Send,
    color: 'blue',
    title: 'Telegram Bot',
    description: 'Send messages via Telegram Bot',
    fields: [
      { name: 'botToken', label: 'Bot Token', type: 'password', placeholder: 'Enter your bot token', required: true },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your message...', required: true },
      { name: 'parseMode', label: 'Parse Mode', type: 'select', options: ['HTML', 'Markdown', 'None'], defaultValue: 'None' }
    ]
  },
  resend: {
    icon: Mail,
    color: 'green',
    title: 'Email',
    description: 'Send email notifications',
    fields: [
      { name: 'resendApi', label: 'Resend_API', type: 'text', placeholder: 're_xxxxxxxxx', required: true },
      { name: 'fromEmail', label: 'From Email', type: 'email', placeholder: 'Sender Email', required: true },
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Email subject', required: true },
      { name: 'body', label: 'Body', type: 'textarea', placeholder: 'Email content...', required: true },
    ]
  }
};