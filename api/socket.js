const users = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', ({ userId }) => {
      users.set(userId, socket.id);
      io.emit('online-users', Array.from(users.keys()));
    });

    socket.on('send-message', ({ sender, receiver, text }) => {
      const receiverSocket = users.get(receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit('receive-message', { sender, text });
      }
    });

    socket.on('typing', ({ sender, receiver }) => {
      const receiverSocket = users.get(receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit('typing', { sender });
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          break;
        }
      }
      io.emit('online-users', Array.from(users.keys()));
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
