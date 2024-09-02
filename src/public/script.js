new Vue({
    el: '#app',
    data: {
        username: '',
        password: '',
        newUsername: '',
        newPassword: '',
        newMessage: '',
        messages: [],
        isLoggedIn: false,
        errorMessage: '',
        registrationError: '',
        showRegistration: false // New data property
    },
    methods: {
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
