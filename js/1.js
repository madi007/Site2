document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("sendBtn");
  const chat = document.getElementById("chat");

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
  let lastDate = "";
  let savedTicket = null; // Объявляем savedTicket только один раз



  // Кнопки
  enterSelectionModeBtn.onclick = () => enterSelectionMode();
  cancelSelectionBtn.onclick = () => exitSelectionMode();
  deleteSelectedBtn.onclick = () => {
    selectedMessages.forEach(msg => msg.remove());
    exitSelectionMode();
    cleanUpEmptyDateDividers();
    saveMessages();
    saveNumbers(); // Сохраняем номера после удаления
  };

  sendBtn.onclick = () => handleSendMessage(input.value);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage(input.value);
  });

  // Логика отправки
  function handleSendMessage(text) {
    text = text.trim();
    if (text === "") return;

    const time = getTime();
    const date = getFormattedDate();

    insertDateDividerIfNeeded(date);

    if (isTicketCode(text)) {
      savedTicket = text;
      chat.appendChild(createMessage("from-user", text, time));
      saveMessages(); // Сохраняем сообщения
      input.value = "";
      return;
    }

    if (isSevenDigitNumber(text) && savedTicket) {
      const datetime = getCurrentDateTime();
      const randomCode = generateRandomCode();
      const response = `ONAY! ALA<br>AT ${datetime}<br>${savedTicket},120₸<br><a href="http://qr.tha.kz/${randomCode}" target="_blank">http://qr.tha.kz/${randomCode}</a>`;

      localStorage.setItem("newMessage", JSON.stringify({
        content: response,
        time: getTime(),
        date: getFormattedDate()
      }));

      savedTicket = null;
      input.value = "";
      return;
    }

    chat.appendChild(createMessage("from-user", text, time));
    saveMessages(); // Сохраняем сообщения
    input.value = "";
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
    inputArea.classList.add("hidden"); // Добавляем класс hidden
    deleteArea.classList.remove("hidden");
    updateSelectedCount();
  }

  function exitSelectionMode() {
    selectionMode = false;
    selectedMessages.forEach(msg => msg.classList.remove("selected"));
    selectedMessages.clear();
    mainHeader.classList.remove("hidden");
    selectionHeader.classList.add("hidden");
    inputArea.classList.remove("hidden"); // Удаляем класс hidden
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

  // Вспомогательные функции
  function getTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // Например: "00:00"
  }
  
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

  function getCurrentDateTime() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  }

  function generateRandomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function isTicketCode(text) {
    return /^[0]{0,3}\d{1,3},\d{3}[A-Z]{2}\d{2}$/.test(text.trim());
  }

  function isSevenDigitNumber(text) {
    return /^\d{7}$/.test(text.trim());
  }

  // Функция для сохранения номеров и 7-значных кодов
  function saveNumbers() {
    const numbers = [];
    const messageRows = document.querySelectorAll("#chat .message-row");
    messageRows.forEach(row => {
      const content = row.querySelector(".message").innerHTML;
      if (/^\d{7}$/.test(content) || /^[0]{0,3}\d{1,3},\d{3}[A-Z]{2}\d{2}$/.test(content)) {
        numbers.push({
          content: content,
          time: row.querySelector(".message-time").textContent
        });
      }
    });
    localStorage.setItem("numbers", JSON.stringify(numbers));
  }

  // Функция для загрузки номеров
  function loadNumbers() {
    const numbers = JSON.parse(localStorage.getItem("numbers")) || [];
    numbers.forEach(num => {
      chat.appendChild(createMessage("from-user", num.content, num.time));
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
        date: getFormattedDate() // Добавляем дату
      });
    });
    localStorage.setItem("chatMessages1", JSON.stringify(messages)); // Используем другой ключ
  }

  // Функция для загрузки сообщений
  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem("chatMessages1")) || []; // Используем тот же ключ
    messages.forEach(msg => {
      insertDateDividerIfNeeded(msg.date);
      chat.appendChild(createMessage(msg.cls, msg.content, msg.time));
    });
  }

  loadMessages();

  loadNumbers(); // Загружаем номера при загрузке страницы
});