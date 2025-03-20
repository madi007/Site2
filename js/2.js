document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  let lastDate = "";

  const enterSelectionModeBtn = document.getElementById("enterSelectionModeBtn");
  const mainHeader = document.getElementById("mainHeader");
  const selectionHeader = document.getElementById("selectionHeader");
  const selectedCountText = document.getElementById("selectedCount");
  const cancelSelectionBtn = document.getElementById("cancelSelectionBtn");

  const inputArea = document.getElementById("inputArea");
  const deleteArea = document.getElementById("deleteArea");
  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");

  let selectionMode = false;
  let selectedMessages = new Set();

  // Кнопки
  enterSelectionModeBtn.onclick = () => enterSelectionMode();
  cancelSelectionBtn.onclick = () => exitSelectionMode();
  deleteSelectedBtn.onclick = () => {
    selectedMessages.forEach(msg => msg.remove());
    exitSelectionMode();
    cleanUpEmptyDateDividers();
    saveMessages();
  };

  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.forEach(msg => {
      insertDateDividerIfNeeded(msg.date);
      chat.appendChild(createMessage("from-system", msg.content, msg.time));
    });
  }

  function displayNewMessage() {
    const newMessage = JSON.parse(localStorage.getItem("newMessage"));
    if (newMessage) {
      const messages = JSON.parse(localStorage.getItem("messages")) || [];
      messages.push(newMessage);
      localStorage.setItem("messages", JSON.stringify(messages));
      localStorage.removeItem("newMessage");
      insertDateDividerIfNeeded(newMessage.date);
      chat.appendChild(createMessage("from-system", newMessage.content, newMessage.time));
    }
  }

  function insertDateDividerIfNeeded(currentDate) {
    if (lastDate !== currentDate) {
      lastDate = currentDate;
      const divider = document.createElement("div");
      divider.className = "date-divider";
      divider.textContent = currentDate;
      chat.appendChild(divider);
    }
  }

  function createMessage(cls, content, time) {
    const row = document.createElement("div");
    row.className = `message-row ${cls}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    const msg = document.createElement("div");
    msg.className = "message";
    msg.innerHTML = content;

    const timeEl = document.createElement("div");
    timeEl.className = "message-time";
    timeEl.textContent = time;

    bubble.appendChild(msg);

    if (cls === 'from-user') {
      row.appendChild(timeEl);
      row.appendChild(bubble);
    } else {
      row.appendChild(bubble);
      row.appendChild(timeEl);
    }

    row.addEventListener("click", () => {
      if (selectionMode) toggleSelection(row);
    });

    return row;
  }

  function toggleSelection(msg) {
    if (selectedMessages.has(msg)) {
      msg.classList.remove("selected");
      selectedMessages.delete(msg);
    } else {
      msg.classList.add("selected");
      selectedMessages.add(msg);
    }
    updateSelectedCount();
  }

  function updateSelectedCount() {
    selectedCountText.textContent = `Выбрано: ${selectedMessages.size}`;
  }

  function enterSelectionMode() {
    selectionMode = true;
    mainHeader.classList.add("hidden");
    selectionHeader.classList.remove("hidden");
    inputArea.classList.add("hidden");
    deleteArea.classList.remove("hidden");
    updateSelectedCount();
  }

  function exitSelectionMode() {
    selectionMode = false;
    selectedMessages.forEach(msg => msg.classList.remove("selected"));
    selectedMessages.clear();
    mainHeader.classList.remove("hidden");
    selectionHeader.classList.add("hidden");
    inputArea.classList.remove("hidden");
    deleteArea.classList.add("hidden");
  }

  function cleanUpEmptyDateDividers() {
    const dividers = chat.querySelectorAll(".date-divider");
    dividers.forEach(divider => {
      let next = divider.nextElementSibling;
      let hasMessages = false;
      while (next && !next.classList.contains("date-divider")) {
        if (next.classList.contains("message-row")) {
          hasMessages = true;
          break;
        }
        next = next.nextElementSibling;
      }
      if (!hasMessages) {
        if (divider.textContent === lastDate) lastDate = "";
        divider.remove();
      }
    });
  }

  // Функция для сохранения сообщений
  function saveMessages() {
    const messages = [];
    const messageRows = document.querySelectorAll("#chat .message-row");
    messageRows.forEach(row => {
      messages.push({
        cls: row.classList.contains("from-user") ? "from-user" : "from-system",
        content: row.querySelector(".message").innerHTML,
        time: row.querySelector(".message-time").textContent,
        date: getFormattedDate()
      });
    });
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  // Вспомогательная функция для получения текущей даты
  function getFormattedDate() {
    const now = new Date();
  
    const date = now.toLocaleDateString("ru-RU", {
      weekday: 'short',  // Вс
      day: 'numeric',    // 19
      month: 'long'      // марта
    });
  
    const time = now.toLocaleTimeString("ru-RU", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  
    return `${date}, ${time}`; // Например: "вс, 19 марта, 00:00"
  }  

  loadMessages();
  displayNewMessage();
  setInterval(displayNewMessage, 500);
});