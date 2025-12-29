import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const DifyChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Thêm custom CSS cho chatbot window
    const style = document.createElement("style");
    style.textContent = `
      /* Ép nền cửa sổ chat thành màu trắng đồng bộ với theme */
      #dify-chatbot-bubble-window iframe {
        background-color: #ffffff !important;
        filter: none !important;
      }

      /* Tùy chỉnh chatbot window cho sang trọng */
      #dify-chatbot-bubble-window {
        border: 1px solid #e5e7eb !important;
        border-radius: 12px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
      }

      /* Smooth animation khi mở chatbot */
      #dify-chatbot-bubble-window {
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  console.log("🤖 [DifyChatbot] Rendering with iframe approach");

  return (
    <>
      {/* Chatbot Iframe Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "400px",
            height: "600px",
            zIndex: 9999,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <iframe
            src="https://udify.app/chatbot/BcbkAB1w3sTe0mYU"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            frameBorder="0"
            allow="microphone"
            title="Dify Chatbot"
          />
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#ec4899",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(236, 72, 153, 0.4)",
          zIndex: 10000,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow =
            "0 6px 16px rgba(236, 72, 153, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(236, 72, 153, 0.4)";
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>
    </>
  );
};

export default DifyChatbot;
