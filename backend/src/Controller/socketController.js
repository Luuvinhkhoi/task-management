const CommentService =require("../Services/commentService")
class Socket {
  static async connection(socket) {
    console.log('User connected:', socket.id);
    socket.on('join-room', (newRoom) => {
        const currentRoom = socket.currentRoom; // room người dùng đang ở

        // Nếu người dùng đã có room trước đó, rời khỏi room đó
        if (currentRoom) {
          socket.leave(currentRoom);
        }
    
        socket.join(newRoom);
        socket.currentRoom = newRoom; // Cập nhật room hiện tại
    });
    socket.on('leave-room', (taskId) => {
      socket.leave(`task-${taskId}`);
      console.log(`User ${socket.user?.username || socket.id} left room for task: ${taskId}`);
    });
    socket.on('new-comment', async (data) => {
      try {
        const savedComment = await CommentService.createComment(data)
        // Gửi lại comment mới cho tất cả client
        _io.to(data.taskId).emit('receive-comment', savedComment);
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