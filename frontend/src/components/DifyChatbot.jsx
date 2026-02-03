import { useEffect } from "react";

const DifyChatbot = () => {
  useEffect(() => {
    console.log("🤖 [DifyChatbot] Initializing Dify chatbot with embed script");

    // Check if script already exists (prevent duplicate)
    const existingScript = document.getElementById("BcbkAB1w3sTe0mYU");
    if (existingScript) {
      console.log(
        "⚠️ [DifyChatbot] Script already exists, skipping initialization",
      );
      return;
    }

    // Set up Dify chatbot configuration
    window.difyChatbotConfig = {
      token: "BcbkAB1w3sTe0mYU",
      inputs: {},
      systemVariables: {},
      userVariables: {},
    };

    // Add custom styles for chatbot
    const style = document.createElement("style");
    style.id = "dify-chatbot-custom-styles";
    style.textContent = `
      #dify-chatbot-bubble-button {
        background-color: #ec4899 !important;
      }
      #dify-chatbot-bubble-window {
        width: 24rem !important;
        height: 40rem !important;
      }
    `;

    // Only append if not already exists
    if (!document.getElementById("dify-chatbot-custom-styles")) {
      document.head.appendChild(style);
    }

    // Load Dify embed script
    const script = document.createElement("script");
    script.src = "https://udify.app/embed.min.js";
    script.id = "BcbkAB1w3sTe0mYU";
    script.defer = true;

    script.onload = () => {
      console.log("✅ [DifyChatbot] Script loaded successfully");
      
      // Check if chatbot button appeared after a delay
      setTimeout(() => {
        const button = document.getElementById("dify-chatbot-bubble-button");
        const window = document.getElementById("dify-chatbot-bubble-window");
        
        if (button) {
          console.log("✅ [DifyChatbot] Bubble button found in DOM");
        } else {
          console.error("❌ [DifyChatbot] Bubble button NOT found in DOM after script load");
          console.log("🔍 [DifyChatbot] Config:", window.difyChatbotConfig);
          console.log("🔍 [DifyChatbot] All scripts:", document.querySelectorAll('script[src*="udify"]'));
        }
        
        if (window) {
          console.log("✅ [DifyChatbot] Bubble window found in DOM");
        }
      }, 2000);
    };

    script.onerror = (error) => {
      console.error("❌ [DifyChatbot] Failed to load script:", error);
    };

    document.body.appendChild(script);

    console.log("✅ [DifyChatbot] Config and script added to DOM");

    // Cleanup function
    return () => {
      // Remove script
      const scriptToRemove = document.getElementById("BcbkAB1w3sTe0mYU");
      if (scriptToRemove && scriptToRemove.parentNode) {
        document.body.removeChild(scriptToRemove);
      }

      // Remove style
      const styleToRemove = document.getElementById(
        "dify-chatbot-custom-styles",
      );
      if (styleToRemove && styleToRemove.parentNode) {
        document.head.removeChild(styleToRemove);
      }

      // Clean up config
      delete window.difyChatbotConfig;

      // Remove chatbot elements if any
      const chatbotButton = document.getElementById(
        "dify-chatbot-bubble-button",
      );
      const chatbotWindow = document.getElementById(
        "dify-chatbot-bubble-window",
      );
      if (chatbotButton && chatbotButton.parentNode)
        chatbotButton.parentNode.removeChild(chatbotButton);
      if (chatbotWindow && chatbotWindow.parentNode)
        chatbotWindow.parentNode.removeChild(chatbotWindow);

      console.log("🧹 [DifyChatbot] Cleaned up");
    };
  }, []);

  // Dify script will render its own bubble and window, so we return null
  return null;
};

export default DifyChatbot;
