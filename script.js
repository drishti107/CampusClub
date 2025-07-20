document.addEventListener("DOMContentLoaded", () => {
    console.log("Campus Club Dashboard is ready!");

    const chatbotToggleBtn = document.getElementById('chatbot-toggle-button');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotBtn = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendMessageBtn = document.getElementById('send-message');

    const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace this with your API key if needed
    const DEFAULT_WEATHER_LOCATION = 'Chhindwara, Madhya Pradesh, IN';

    function openChatbot() {
        chatbotContainer.classList.add('active');
        chatbotInput.focus();
        scrollToBottom();
    }

    chatbotToggleBtn.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    sendMessageBtn.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user-message');
        chatbotInput.value = '';
        processBotResponse(userMessage);
    }

    function appendMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTo({ top: chatbotMessages.scrollHeight, behavior: 'smooth' });
    }

    async function processBotResponse(message) {
        const lowerCaseMessage = message.toLowerCase();
        let botResponse = "I'm sorry, I couldn't quite understand that. Try asking for 'help' to see what I can do!";
        let navigateTo = null;

        if (lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hello')) {
            botResponse = "Hello there! How can I assist you today on CampusClubs?";
        } else if (lowerCaseMessage.includes('how are you')) {
            botResponse = "I'm a bot, so I don't have feelings, but I'm operating perfectly and ready to help!";
        } else if (lowerCaseMessage.includes('what is your name') || lowerCaseMessage.includes('who are you')) {
            botResponse = "I am CampusClubs Chatbot, your friendly virtual assistant for this website!";
        } else if (lowerCaseMessage.includes('what time is it') || lowerCaseMessage.includes('time now')) {
            const now = new Date();
            botResponse = `The current time is ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.`;
        } else if (lowerCaseMessage.includes('what is the date') || lowerCaseMessage.includes('date today')) {
            const now = new Date();
            botResponse = `Today's date is ${now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks') || lowerCaseMessage.includes('cheers')) {
            botResponse = "You're most welcome! Glad I could help. Is there anything else?";
        } else if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye') || lowerCaseMessage.includes('see ya')) {
            botResponse = "Goodbye! Have a great day and enjoy exploring CampusClubs!";
        } else if (lowerCaseMessage.includes('help')) {
            botResponse = "I can help you navigate or answer some basic questions. Try asking me:\n" +
                "- 'Dashboard', 'Events', or 'Profile' to navigate.\n" +
                "- 'What's the weather like?' or 'Weather in [City]?'.\n" +
                "- 'What time is it?' or 'What's the date?'\n" +
                "- 'Tell me about clubs' or 'Who are you?'\n" +
                "Just type your question!";
        } else if (lowerCaseMessage.includes('tell me about clubs') || lowerCaseMessage.includes('what clubs are there')) {
            botResponse = "CampusClubs features a variety of clubs! Currently highlighted are the Tech Club, Music Club, and Drama Club.";
        } else if (lowerCaseMessage.includes('what is this site') || lowerCaseMessage.includes('about campusclubs')) {
            botResponse = "CampusClubs is a platform to help students explore and grow with clubs across campus.";
        } else if (lowerCaseMessage.includes('weather')) {
            const parts = lowerCaseMessage.split('weather in ');
            let location = DEFAULT_WEATHER_LOCATION;
            if (parts.length > 1) {
                location = parts[1].trim();
            }
            appendMessage(`Fetching weather for ${location}...`, 'bot-message');
            await getWeatherData(location);
            return;
        } else if (lowerCaseMessage.includes('dashboard') || lowerCaseMessage.includes('home')) {
            botResponse = "Sure, navigating you to the Dashboard!";
            navigateTo = 'index.html';
        } else if (lowerCaseMessage.includes('events') || lowerCaseMessage.includes('event')) {
            botResponse = "Of course! Let me take you to the Events page.";
            navigateTo = 'events.html';
        } else if (lowerCaseMessage.includes('profile') || lowerCaseMessage.includes('my profile')) {
            botResponse = "No problem! Taking you to your Profile page.";
            navigateTo = 'profile.html';
        } else if (lowerCaseMessage.includes('settings')) {
            botResponse = "I'm sorry, there isn't a 'Settings' page currently available.";
        }

        setTimeout(() => {
            appendMessage(botResponse, 'bot-message');
            if (navigateTo) {
                setTimeout(() => {
                    window.location.href = navigateTo;
                }, 1000);
            }
        }, 500);
    }

    async function getWeatherData(location) {
        if (OPENWEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || !OPENWEATHER_API_KEY) {
            appendMessage("Weather feature is not configured. Please set your OpenWeatherMap API key in script.js.", 'bot-message');
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    appendMessage(`Could not find weather data for "${location}". Please check the spelling or try a different city.`, 'bot-message');
                } else {
                    appendMessage(`Failed to fetch weather data. Status: ${response.status}`, 'bot-message');
                }
                return;
            }

            const data = await response.json();
            const cityName = data.name;
            const country = data.sys.country;
            const temp = data.main.temp;
            const feelsLike = data.main.feels_like;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            const weatherMessage =
                `Current weather in ${cityName}, ${country}:\n` +
                `Temperature: ${temp}°C (feels like ${feelsLike}°C)\n` +
                `Conditions: ${description.charAt(0).toUpperCase() + description.slice(1)}\n` +
                `Humidity: ${humidity}%\n` +
                `Wind Speed: ${windSpeed} m/s`;

            appendMessage(weatherMessage, 'bot-message');

        } catch (error) {
            console.error('Error fetching weather:', error);
            appendMessage("There was an issue retrieving weather data. Please try again later.", 'bot-message');
        }
    }
});
