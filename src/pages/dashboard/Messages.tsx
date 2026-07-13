import { memo, useState } from 'react';
import { Mail } from 'lucide-react';
import { Message } from './types'; // We'll create this

interface MessagesProps {
  messages: Message[];
  loading: boolean;
}

const Messages = memo(({ messages, loading }: MessagesProps) => {
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
          {messages.length} رسالة
        </span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            لا توجد رسائل جديدة
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{msg.name}</h3>
                  <a href={`mailto:${msg.email}`} className="text-sm text-[#0284C7] hover:underline">
                    {msg.email}
                  </a>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <p className="text-gray-700 mt-3 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

Messages.displayName = 'Messages';
export default Messages;
