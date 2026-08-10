import { memo } from 'react';
import { Check, Mail, Trash2 } from 'lucide-react';
import { Message } from './types';
import { getContactHref } from './dashboard-utils.mjs';

interface MessagesProps {
  messages: Message[];
  loading: boolean;
  onMarkRead: (id: string | number) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
}

const Messages = memo(({ messages, loading, onMarkRead, onDelete }: MessagesProps) => {
  if (loading) {
    return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#0284C7]" />
          الرسائل الواردة
        </h2>
        <span className="bg-blue-50 text-[#0284C7] px-3 py-1 rounded-full text-sm font-bold">
          {(messages || []).length} رسالة
        </span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {(messages || []).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد رسائل جديدة
          </div>
        ) : (
          (messages || []).map((msg) => {
            const contact = msg.phone || msg.email || '';
            const isEmail = contact.includes('@');
            return (
            <div key={msg.id} className={`p-6 hover:bg-gray-50 transition-colors ${msg.is_read ? '' : 'bg-blue-50/40'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{msg.name}</h3>
                  {contact && (
                    <a href={getContactHref(contact)} className="text-sm text-[#0284C7] hover:underline" dir={isEmail ? 'ltr' : 'rtl'}>
                      {contact}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleDateString('ar-SA')}
                  </span>
                  {!msg.is_read && (
                    <button onClick={() => onMarkRead(msg.id)} className="p-2 text-green-700 hover:bg-green-50 rounded" title="تحديد كمقروءة">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => onDelete(msg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="حذف الرسالة">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-3 whitespace-pre-wrap">{msg.message}</p>
            </div>
          )})
        )}
      </div>
    </div>
  );
});

Messages.displayName = 'Messages';
export default Messages;
