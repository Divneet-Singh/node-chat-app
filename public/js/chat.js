const socket = io();

// elements

const messageFormsElem = document.querySelector("#message-form");
const messageFormInput = document.querySelector("input");
const messageFormButton = document.querySelector("button");
const sendLocationButton = document.querySelector("#send-location");
const messagesEl = document.querySelector("#messages");

// templates

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    // new message elem
    const newMessage = messagesEl.lastElementChild;

    // height of the new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // visible height
    const visibleHeight = messages.offsetHeight;

    // heigth of messages container
    const containerHeight = messages.scrollHeight;

    // how far have i scrolled
    const scrollOffset = messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight;
    }
}

socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("hh:mm a"),
        username: message.username
    });
    messagesEl.insertAdjacentHTML("beforeend", html);
    autoScroll();
})

socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        locationUrl: message.url,
        createdAt: moment(message.createdAt).format("hh:mm a"),
        username: message.username
    });
    messagesEl.insertAdjacentHTML("beforeend", html);
    autoScroll();
})

socket.on("roomData", ({ room, users }) => {

    const html = Mustache.render(sidebarTemplate, {
        room: room,
        users: users
    });
    document.querySelector("#sidebar").innerHTML = html;
})

messageFormsElem.addEventListener("submit", (e) => {
    e.preventDefault();
    messageFormButton.setAttribute("disabled", "disabled");
    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
        messageFormButton.removeAttribute("disabled");
        messageFormInput.value = "";
        messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        return console.log("the message was delivered");
    });
})

sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geo location is not supported by your browser");
    }
    sendLocationButton.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            sendLocationButton.removeAttribute("disabled");
            console.log("Location Shared");
        });
    })
})

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/"
    }
});