new Vue({
  el: "#app",
  data: {
    username: "",
    password: "",
    newUsername: "",
    newPassword: "",
    newMessage: "",
    newRoomName: "",
    newRoomPassword: "",
    messages: [],
    rooms: [], // Array to hold existing rooms
    isLoggedIn: false,
    errorMessage: "",
    registrationError: "",
    showRegistration: false,
    activeRoom: null,
    openPasswordModal: false,
    roomPassword: "",
    roomError: "",
    ws: null,
    userId: null,
  },
  created() {
    this.checkToken();
    this.connectWebSocket();
  },
  methods: {
    checkToken() {
      const token = localStorage.getItem("token");
      if (token) {
        fetch("/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              this.isLoggedIn = true;
              this.fetchRooms();
              return response.json();
            } else {
              localStorage.removeItem("token"); // Remove invalid token
            }
          })
          .then((data) => {
            this.userId = data.id;
            this.username = data.username;
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username);
          })
          .catch((error) => {
            console.error("Token verification failed:", error);
            localStorage.removeItem("token"); // Remove invalid token
          });
      } else {
        this.isLoggedIn = false;
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
      }
    },
    login() {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: this.username, password: this.password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid credentials");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data, " -------------------data");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          this.userId = data.userId;
          this.isLoggedIn = true;
          this.errorMessage = "";
          this.fetchRooms();
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    register() {
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: this.newUsername, password: this.newPassword }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Registration failed");
          }
          return response.json();
        })
        .then((data) => {
          this.newUsername = "";
          this.newPassword = "";
          this.registrationError = "";
          this.showRegistration = false; // Reset showRegistration to false
          alert("Registration successful! You can now log in.");
        })
        .catch((error) => {
          this.registrationError = error.message;
        });
    },
    createRoom() {
      fetch("/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: this.newRoomName, password: this.newRoomPassword }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Room creation failed", response);
        }
        this.newRoomName = ""; // Clear the input after successful creation
        this.fetchRooms(); // Refresh the room list
      })
      .catch((error) => {
        console.error(error.message);
      });
    },
    fetchRooms() {
      fetch("/room", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.rooms = data; // Update the rooms array with fetched data
        });
    },
    joinRoom(room) {
      this.activeRoom = room;
      fetch(`/room/${room.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password: this.roomPassword }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          if (response.status === 400) {
            this.roomError = "Invalid password";
            this.activeRoom = null;
            return;
          }
          this.messages = response.data;
          console.debug("response" + response);
          // print the response tree with keys
          console.debug("response keys" + Object.keys(response));
        })
        .then((data) => {
          this.activeRoom = room;
          this.messages = data;
          this.connectWebSocket();
        })
        .catch((error) => {
          this.roomError = error.message;
          this.activeRoom = null;
        });
    },
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.messages = [];
    },
    fetchMessages() {
      fetch("/messages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.messages = data;
        });
    },
    sendMessage() {
      if (this.ws === null) {
        this.connectWebSocket();
      }
      const message = {
        userId: this.userId,
        username: localStorage.getItem("username"),
        roomId: this.activeRoom.id,
        message: this.newMessage,
      };
      this.messages.push(message);
      this.ws.send(JSON.stringify(message));
      this.newMessage = "";
    },
    connectWebSocket() {
      if (!this.activeRoom) {
        return;
      }
      this.ws = new WebSocket(`ws://localhost:3000?token=${localStorage.getItem("token")}&roomID=${this.activeRoom.id}`);
      this.ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      this.ws.onmessage = (event) => {
        const messageReceived = JSON.parse(event.data);
        const message = {
          userId: messageReceived.userId,
          username: messageReceived.username,
          roomId: messageReceived.roomId,
          message: messageReceived.message,
        };
        this.messages.push(message); // Add the received message to the messages array
        this.$nextTick(() => {
          const chatWindow = this.$el.querySelector("#chat-window");
          chatWindow.scrollTop = chatWindow.scrollHeight;
        });
      };

      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    },
  },
});

