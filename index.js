function getConversationMetadata() {
  const userAgent = navigator.userAgent;
  let deviceName;
  let browserName;
  const browserLanguage = navigator.language;

  // Check for common device identifiers
  if (userAgent.match(/iPhone/i)) deviceName = "iPhone";
  else if (userAgent.match(/iPad/i)) deviceName = "iPad";
  else if (userAgent.match(/Android/i)) deviceName = "Android";
  else if (userAgent.match(/Windows Phone/i)) deviceName = "Windows";
  else
    deviceName =
      navigator?.userAgentData?.platform || navigator.platform || "unknown";

  // Check for common browser identifiers
  if (userAgent.indexOf("Chrome") !== -1) browserName = "Chrome";
  else if (userAgent.indexOf("Firefox") !== -1) browserName = "Firefox";
  else if (userAgent.indexOf("Safari") !== -1) browserName = "Safari";
  else if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1)
    browserName = "Opera";
  else if (userAgent.indexOf("Edge") !== -1) browserName = "Edge";
  else if (
    userAgent.indexOf("MSIE") !== -1 ||
    userAgent.indexOf("Trident/") !== -1
  )
    browserName = "Internet Explorer";
  else browserName = "Unknown";

  return {
    deviceName,
    browserName,
    browserLanguage,
  };
}

const { deviceName, browserName, browserLanguage } = getConversationMetadata();

function btnClickHandler(event) {
  const dealName = event.target.getAttribute("data-deal");
  window.conversationIds = window.conversationIds || {};
  window.currentDealObj = window.currentDealObj || {};
  window.currentDeal = dealName;

  if (window.kommunicate) {
    if (!window.currentDealObj[dealName]) {
      window.currentDealObj[dealName] = dealName;
      const conversationDetail = {
        assignee: "ed-gtalu",
        conversationMetadata: {
          Device: deviceName,
          Browser: browserName,
          "Browser Language": browserLanguage,
        },
      };
      var defaultSettings = {
        defaultBotIds: ["ed-gtalu"], // Optional. Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
        defaultAssignee: "ed-gtalu", // Optional. Replace <BOT_ID> with your bot ID which you can find in bot section of dashboard
        skipRouting: true,
      };
      window.Kommunicate.updateSettings(defaultSettings);
      window.kommunicate.startConversation(conversationDetail);
    } else {
      window.kommunicate.openConversation(
        window.conversationIds[window.currentDeal]
      );
    }
    Kommunicate?.displayKommunicateWidget(true);
  }
}

document
  .querySelectorAll("button")
  .forEach((ele) => ele.addEventListener("click", btnClickHandler));

(function (d, m) {
  var kommunicateSettings = {
    appId: "253789f2670b833362b314f6bc63d3feb",
    popupWidget: true,
    automaticChatOpenOnNavigation: true,
    popupWidget: !1,
    onInit: () => {
      Kommunicate?.displayKommunicateWidget(false);
      const closeBtn = window.KommunicateGlobal?.document.getElementById(
        "km-chat-widget-close-button"
      );
      closeBtn?.addEventListener("click", (event) => {
        Kommunicate?.displayKommunicateWidget(false);
      });
      const events = {
        onChatWidgetOpen: function (a) {
          const currentConversation = window.conversationIds ?? {};
          if (!currentConversation[window.currentDeal]) {
            window.kommunicate.openConversation(
              currentConversation[window.currentDeal]
            );
          }
        },
        onMessageReceived: function (a) {
          window.conversationIds = {
            ...window.conversationIds,
            [window.currentDeal]:
              window.KommunicateGlobal.CURRENT_GROUP_DATA.tabId,
          };
        },
      };
      window.kommunicate.subscribeToEvents(events);
    },
  };
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.async = true;
  s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
  var h = document.getElementsByTagName("head")[0];
  h.appendChild(s);
  window.kommunicate = m;
  m._globals = kommunicateSettings;
})(document, window.kommunicate || {});
