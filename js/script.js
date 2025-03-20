const messages = [
    {
      sender: "ONAY",
      text: "...",
      time: "00:00",
      avatar: "icons/ic_avatar.svg",
      link: "layouts/2.html"
    },
    {
      sender: "9909",
      text: "...",
      time: "00:00",
      avatar: "icons/ic_avatar.svg",
      link: "layouts/1.html"
    },
  ];
  
  const container = document.getElementById("messages");
  
  messages.forEach(msg => {
    const el = document.createElement("div");
    el.className = "message";
    el.innerHTML = `
      <img src="${msg.avatar}" alt="${msg.sender}">
      <div class="message-content">
        <div class="sender-row">
          <span class="sender">${msg.sender}</span>
          <span class="time">${msg.time}</span>
        </div>
        <div class="preview">${msg.text}</div>
      </div>
    `;
  
    if (msg.link) {
      el.addEventListener("click", () => {
        window.location.href = msg.link;
      });
    }
  
    container.appendChild(el);
  });
  