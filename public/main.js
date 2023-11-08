(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const joinUserButton = document.getElementById("join-user");

    // รเข้าร่วมห้องแชท
    function joinChatroom() {
      let username = usernameInput.value;
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    }
    // ตรวจจับการกดปุม Enter ในช่อง username
    usernameInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        joinChatroom();
      }
    });

    // ตรวจจับการคลิกที่ปุ่ม "Join"
    joinUserButton.addEventListener("click", function () {
      joinChatroom();
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById("message-input");
    const sendMessageButton = app.querySelector(".chat-screen #send-message");

    // รส่งข้อความ
    function sendMessage() {
      let message = messageInput.value;
      if (message.length === 0) {
        return;
      }
      renderMessage("my", {
        username: uname,
        text: message,
      });
      socket.emit("chat", {
        username: uname,
        text: message,
      });
      messageInput.value = "";
    }

    // ตรวจจับการกดปุม Enter
    messageInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });

    // ตรวจจับการคลิกที่ปุ่ม "Send"
    sendMessageButton.addEventListener("click", function () {
      sendMessage();
    });
  });

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exituser", uname);
      window.location.href = window.location.href;
    });

  socket.on("update", function (update) {
    renderMessage("update", update);
  });

  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
				<div>
                <div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
      messageContainer.appendChild(el);
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
				<div>
					<div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }
    // scroll chat to end
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
