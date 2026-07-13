import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message: `[سؤال عبر المحادثة السريعة]: ${message}`
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setName('');
          setEmail('');
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-[#0284C7] text-white p-4 rounded-full shadow-lg hover:bg-[#0369A1] transition-transform hover:scale-110"
        aria-label="تواصل معنا"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-[#0284C7] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-bold text-sm">محادثة سريعة</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-[#0369A1] p-1 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 h-64 overflow-y-auto">
              <div className="bg-white p-3 rounded-lg rounded-tr-none shadow-sm text-sm text-gray-700 border border-gray-100 mb-4 inline-block">
                مرحباً بك! هل لديك أي استفسار حول مواصفات الزجاج أو خدماتنا؟
              </div>

              {isSuccess && (
                <div className="bg-[#E0F2FE] p-3 rounded-lg shadow-sm text-sm text-[#0284C7] border border-[#BAE6FD] inline-block">
                  تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                </div>
              )}
            </div>

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
                <div className="space-y-3 mb-3">
                  <input
                    type="text"
                    placeholder="الاسم"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#0284C7] focus:border-[#0284C7] outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="البريد الإلكتروني أو رقم الهاتف"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#0284C7] focus:border-[#0284C7] outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="اكتب رسالتك هنا..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-sm pr-3 pl-10 py-2 border border-gray-200 rounded-full focus:ring-1 focus:ring-[#0284C7] focus:border-[#0284C7] outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !email || !message}
                    className="absolute left-1.5 top-1.5 p-1.5 bg-[#0284C7] text-white rounded-full hover:bg-[#0369A1] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 rtl:-scale-x-100" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
