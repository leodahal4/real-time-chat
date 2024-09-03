new Vue({
    el: '#app',
    data: {
        username: '',
        password: '',
        newUsername: '',
        newPassword: '',
        newMessage: '',
        newRoomName: '', // New data property for room creation
        messages: [],
        rooms: [], // Array to hold existing rooms
        isLoggedIn: false,
        errorMessage: '',
        registrationError: '',
        showRegistration: false // New data property
    },
    created() {
        this.checkToken();
        this.fetchRooms(); // Fetch existing rooms on component creation
    },
    methods: {
        checkToken() {
            const token = localStorage.getItem('token');
            if (token) {
                fetch('/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.ok) {
                        this.isLoggedIn = true; // Set logged in status to true
                        this.fetchMessages(); // Fetch messages if the token is valid
                    } else {
                        localStorage.removeItem('token'); // Remove invalid token
                    }
                })
                .catch(error => {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token'); // Remove invalid token
                });
            }
        },
        login() {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: this.username, password: this.password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                this.isLoggedIn = true;
                this.errorMessage = '';
                this.fetchMessages();
                this.fetchRooms(); // Fetch rooms after login
            })
            .catch(error => {
                this.errorMessage = error.message;
            });
        },
        register() {
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: this.newUsername, password: this.newPassword })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed');
                }
                return response.json();
            })
            .then(data => {
                this.newUsername = '';
                this.newPassword = '';
                this.registrationError = '';
                this.showRegistration = false; // Reset showRegistration to false
                alert('Registration successful! You can now log in.');
            })
            .catch(error => {
                this.registrationError = error.message;
            });
        },
        createRoom() {
            fetch('/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: this.newRoomName })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Room creation failed');
                }
                this.newRoomName = ''; // Clear the input after successful creation
                this.fetchRooms(); // Refresh the room list
            })
            .catch(error => {
                console.error(error.message);
            });
        },
        fetchRooms() {
            fetch('/rooms', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.rooms = data; // Update the rooms array with fetched data
            });
        },
        joinRoom(roomName) {
            // Logic to join the room can be implemented here
            console.log(`Joining room: ${roomName}`);
            // You may want to implement logic to switch the chat context to the selected room
        },
        logout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.messages = [];
        },
        fetchMessages() {
            fetch('/messages', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.messages = data;
            });
        },
        sendMessage() {
            fetch('/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message: this.newMessage })
            })
            .then(response => response.json())
            .then(data => {
                this.messages.push(data);
                this.newMessage = '';
            });
        }
    }
});
