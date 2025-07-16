import React, { useRef, useState, useEffect } from "react";
import "./App.css";

// -- Brand Color Variables --
const BRAND_COLORS = {
  primary: "#1e293b",
  secondary: "#64748b",
  accent: "#38bdf8",
};
const BOT_NAME = "KaviaBot";

// Message bubble component
// PUBLIC_INTERFACE
function MessageBubble({ message, sender }) {
  // Adjust for bot/user colors
  const isBot = sender === "bot";
  return (
    <div
      className={`flex mb-2 ${
        isBot ? "justify-start" : "justify-end"
      } transition-all`}
    >
      <div
        className={`rounded-xl px-4 py-2 max-w-[80%] shadow-sm text-sm ${
          isBot
            ? "bg-gray-100 text-gray-900 dark:bg-slate-800 dark:text-white"
            : "bg-blue-500 text-white"
        } animate-fadein`}
        aria-label={isBot ? "Bot message" : "Your message"}
      >
        {message}
      </div>
    </div>
  );
}

// FAQ accordion component
// PUBLIC_INTERFACE
function FAQAccordion({ faqs, onSendFAQ }) {
  const [openIndex, setOpenIndex] = useState(null);

  // Allow keyboard navigation for accessibility
  const handleKeyDown = (idx, e) => {
    if (e.key === "Enter" || e.key === " ") {
      setOpenIndex(openIndex === idx ? null : idx);
    }
  };

  return (
    <div className="w-full mt-4" aria-label="Frequently Asked Questions">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
        FAQ
      </h2>
      <ul>
        {faqs.map((faq, idx) => (
          <li key={faq.q} className="mb-1">
            <button
              className="w-full flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-expanded={openIndex === idx}
              aria-controls={`faq-panel-${idx}`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              onKeyDown={e => handleKeyDown(idx, e)}
            >
              <span>{faq.q}</span>
              <span className="ml-4 text-accent text-lg" aria-hidden="true">
                {openIndex === idx ? "−" : "+"}
              </span>
            </button>
            {openIndex === idx && (
              <div
                id={`faq-panel-${idx}`}
                className="px-4 py-2 bg-gray-50 dark:bg-slate-800 border-l-4 border-accent animate-fadein"
                tabIndex={0}
              >
                <span className="block mb-2 text-gray-700 dark:text-gray-200">
                  {faq.a}
                </span>
                <button
                  className="mt-2 text-sm px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-accent hover:text-white focus:ring-2 focus:ring-accent"
                  onClick={() => onSendFAQ(faq.q)}
                  aria-label={`Send "${faq.q}"`}
                >
                  Ask this
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Chat input component with accessible send
// PUBLIC_INTERFACE
function ChatInput({ value, onChange, onSend, disabled, placeholder }) {
  const inputRef = useRef();

  // Send message by pressing Enter
  function handleKeyDown(e) {
    if (e.key === "Enter" && value.trim()) {
      onSend();
    }
  }

  return (
    <form
      className="flex bg-white dark:bg-slate-800 border-t border-slate-300 dark:border-slate-700 p-2 gap-2"
      onSubmit={e => {
        e.preventDefault();
        if (value.trim()) onSend();
      }}
      aria-label="Chat input"
    >
      <input
        aria-label="Type your message"
        ref={inputRef}
        type="text"
        className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2 focus:ring-2 focus:ring-accent focus:outline-none bg-gray-50 dark:bg-slate-700 text-black dark:text-white transition"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-accent px-4 py-2 rounded-lg text-white font-semibold shadow transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        aria-label="Send message"
      >
        <span className="hidden sm:inline">Send</span>
        <span className="sm:hidden text-lg" aria-hidden="true">
          ➤
        </span>
      </button>
    </form>
  );
}

// Branding header
// PUBLIC_INTERFACE
function BrandingHeader() {
  return (
    <header className="flex items-center gap-3 justify-center py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-20">
      <span
        className="w-10 h-10 rounded-full bg-accent flex justify-center items-center font-extrabold text-2xl text-white shadow"
        aria-label="Company logo"
      >
        {/* Placeholder, replace with actual logo if needed */}
        <span>K</span>
      </span>
      <span className="font-extrabold text-lg text-black dark:text-white tracking-wide">
        Kavia Company Chatbot
      </span>
    </header>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  // Accessbility: use dark mode detection for user preference
  useEffect(() => {
    // Fallback: light theme, user can change
    document.body.classList.add("bg-slate-50");
  }, []);

  // Chat state
  const [messages, setMessages] = useState([
    {
      message: "Hi there 👋 How can I help you today?",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Simple FAQ demo data
  const faqData = [
    {
      q: "What services do you offer?",
      a: "We provide AI-powered solutions, chatbot interfaces, and web development for professional businesses.",
    },
    {
      q: "How can I get support?",
      a: "Click the chat input and type your question, or select an FAQ above.",
    },
    {
      q: "Is this chatbot available 24/7?",
      a: "Yes, our chatbot is available to assist you at any time.",
    },
  ];

  // Handle sending message
  function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { message: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response delay for effect
    setTimeout(() => {
      // Example bot reply -- replace with backend integration
      setMessages(prev => [
        ...prev,
        {
          message: `You asked: "${input}". Our team will get back to you soon!`,
          sender: "bot",
        },
      ]);
      setIsTyping(false);
    }, 1100);
  }

  // When user clicks FAQ ask button
  function handleSendFAQ(faqQuestion) {
    setInput(faqQuestion);
    setTimeout(() => {
      sendMessage();
    }, 150);
  }

  // Smoothly scroll to bottom on message update
  const chatEndRef = useRef(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping]);

  return (
    <div
      className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200"
      style={{
        "--accent": BRAND_COLORS.accent,
        "--primary": BRAND_COLORS.primary,
        "--secondary": BRAND_COLORS.secondary,
      }}
    >
      <BrandingHeader />
      {/* Main Chat Section */}
      <main
        className="flex flex-1 flex-col items-center w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-3 mb-0 relative transition-all"
        aria-label="Chatbot conversation"
      >
        {/* FAQ floated at top for visibility on mobile */}
        <section className="w-full px-4 pt-2 pb-0">
          <FAQAccordion faqs={faqData} onSendFAQ={handleSendFAQ} />
        </section>
        {/* Chat window */}
        <section
          className="flex-1 overflow-y-auto w-full px-4 pb-1 pt-2 bg-transparent"
          style={{ minHeight: "300px", maxHeight: "50vh" }}
          tabIndex={0}
          aria-live="polite"
          aria-label="Conversation history"
        >
          <div>
            {messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                message={msg.message}
                sender={msg.sender}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pulse mb-2">
                <div className="rounded-xl px-4 py-2 bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-white shadow-sm text-sm opacity-90">
                  <span
                    className="inline-block align-middle"
                    aria-label="Bot is typing"
                  >
                    {BOT_NAME} is typing
                    <span className="ml-1 animate-bounce">...</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} tabIndex={-1} />
          </div>
        </section>
        {/* Chat input */}
        <section className="w-full px-4 pb-3 pt-1 sticky bottom-0 bg-white dark:bg-slate-900 shadow-inner rounded-b-xl z-10">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            disabled={isTyping}
            placeholder="Type your question..."
          />
        </section>
      </main>
      {/* Accessibility footnote */}
      <footer className="w-full mt-2 text-center text-xs text-slate-400 py-3">
        Powered by <span className="font-semibold text-accent">Kavia</span> | Accessible chatbot |{" "}
        <a
          href="#"
          className="underline hover:text-accent focus:text-accent"
        >
          Accessibility Statement
        </a>
      </footer>
      {/* Custom styles for accent color */}
      <style>{`
        .bg-accent { background-color: var(--accent); }
        .text-accent { color: var(--accent); }
        .focus\\:ring-accent:focus { box-shadow: 0 0 0 2px var(--accent); }
        .border-accent { border-color: var(--accent); }
        .animate-fadein {
          animation: fadeIn 0.33s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px);}
          to   { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
}
