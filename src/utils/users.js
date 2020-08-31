const users = [];

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        return {
            error: "Username and room are required"
        }
    }

    // check for existing users
    const existingUser = users.find(user => user.room === room && user.username === username);

    if (existingUser) {
        return {
            error: "Username is in use"
        }
    }

    // Store user
    const user = { id, username, room };
    users.push(user);
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const theUser = users.find(user => user.id === id);
    return theUser;
}

const getUsersInRoom = (room) => {
    console.log(room, users);
    return users.filter(user => user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}