import { useEffect } from "react";

const DifyChatbot = () => {
  useEffect(() => {
    console.log("🤖 [DifyChatbot] Initializing Dify chatbot with embed script");

    // Set up Dify chatbot configuration
    window.difyChatbotConfig = {
      token: "BcbkAB1w3sTe0mYU",
      inputs: {
        // You can define the inputs from the Start node here
        // key is the variable name
        // e.g.
        // name: "NAME"
      },
      systemVariables: {
        // user_id: 'YOU CAN DEFINE USER ID HERE',
        // conversation_id: 'YOU CAN DEFINE CONVERSATION ID HERE, IT MUST BE A VALID UUID',
      },
      userVariables: {
        // avatar_url: 'YOU CAN DEFINE USER AVATAR URL HERE',
        // name: 'YOU CAN DEFINE USER NAME HERE',
      },
    };

    // Add custom styles for chatbot
    const style = document.createElement("style");
    style.textContent = `
      #dify-chatbot-bubble-button {
        background-color: #ec4899 !important;
      }
      #dify-chatbot-bubble-window {
        width: 24rem !important;
        height: 40rem !important;
      }
    `;
    document.head.appendChild(style);

    // Load Dify embed script
    const script = document.createElement("script");
    script.src = "https://udify.app/embed.min.js";
    script.id = "BcbkAB1w3sTe0mYU";
    script.defer = true;
    document.body.appendChild(script);

    console.log("✅ [DifyChatbot] Config and script loaded");

    // Cleanup function
    return () => {
      // Remove script
      const existingScript = document.getElementById("BcbkAB1w3sTe0mYU");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }

      // Remove style
      if (style.parentNode) {
        document.head.removeChild(style);
      }

      // Clean up config
      delete window.difyChatbotConfig;

      console.log("🧹 [DifyChatbot] Cleaned up");
    };
  }, []);

  // Dify script will render its own bubble and window, so we return null
  return null;
};

export default DifyChatbot;
