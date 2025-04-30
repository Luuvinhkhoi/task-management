const CommentService =require("../Services/commentService")
class Socket {
  static async connection(socket) {
    console.log('User connected:', socket.id);
    socket.on('join-room', (roomName) => {
      socket.join( `task-${roomName}`);
      console.log(`User ${socket.id} joined room ${roomName}`);
      });
    socket.on('leave-room', (taskId) => {
      socket.leave(`task-${taskId}`);
      console.log(`User ${socket.user?.username || socket.id} left room for task: ${taskId}`);
    });
    socket.on('new-comment', async (data) => {
      console.log('receive comment')
      try {
        // Gửi lại comment mới cho tất cả client
        console.log('receive comment')
        _io.to(`task-${data.taskId}`).emit('receive-comment', data);
      } catch (err) {
        console.error('Error saving comment:', err.message);
        socket.emit('error-comment', { message: 'Failed to save comment' });
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

  }
}
module.exports=Socket