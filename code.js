/**
 * Telegram to Google Sheets Automation Bot Template created by aaditya maheshwari
 * * Instructions: 
 * 1. Replace the placeholder values in the CONFIG object below with your own credentials.
 * 2. Deploy this script as a Web App to get your Web App URL.
 * 3. Run the 'setWebhook' function once to connect your Telegram bot.
 */

const CONFIG = {
  TELEGRAM_TOKEN: "YOUR_TELEGRAM_BOT_TOKEN", // Paste your Bot token from @BotFather
  SHEET_NAME: "Sheet1"                            // Name of your active sheet tab (i made it my way you can modify)
};

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    if (!contents.message || !contents.message.text) return;
    
    const chatId = contents.message.chat.id;
    const text = contents.message.text;
    
    // Ignore the /start command and give structural guidance
    if (text.toLowerCase() === "/start") {
      sendText(chatId, "👋 Bot is active!\n\nPlease send data using this exact comma format:\nName, Insta Link, Contact No, Status");
      return;
    }
    
    // Split incoming text by comma
    const dataArray = text.split(",").map(item => item.trim());
    
    // Check if the input contains all 4 required fields
    if (dataArray.length < 4) {
      sendText(chatId, "❌ Formatting Error!\n\nPlease use the exact format:\nName, Insta Link, Contact No, Status");
      return;
    }
    
    const name = dataArray[0];
    const instaLink = dataArray[1];
    const contact = dataArray[2];
    const status = dataArray[3];
    
    // Automatically selects the very first sheet tab to prevent naming errors
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([name, instaLink, contact, status]);
    
    sendText(chatId, `✅ Added "${name}" to the sheet successfully!`);
    
  } catch(error) {
    Logger.log(error.toString());
  }
}

function sendText(chatId, text) {
  const url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_TOKEN + "/sendMessage";
  const payload = {
    "method": "post",
    "payload": {
      "chat_id": String(chatId),
      "text": text
    }
  };
  UrlFetchApp.fetch(url, payload);
}

/**
 * RUN THIS FUNCTION ONCE TO CONNECT TELEGRAM TO GOOGLE
 * Make sure you have deployed as a Web App first!
 */
function setWebhook() {
  const scriptUrl = ScriptApp.getService().getUrl();
  
  if (!scriptUrl || scriptUrl.indexOf("exec") === -1) {
    Logger.log("❌ Error: Deploy your script as a Web App first to get a live URL!");
    return;
  }
  
  const url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_TOKEN + "/setWebhook?url=" + scriptUrl;
  const response = UrlFetchApp.fetch(url);
  Logger.log("Result: " + response.getContentText());
}