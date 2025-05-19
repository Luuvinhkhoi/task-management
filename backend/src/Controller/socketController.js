class Socket {
  static async connection(socket) {
    console.log('User connected:', socket.user);
    socket.join(`user-${socket.user}`);
    socket.on('join-task', (roomName) => {
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
    socket.on('new-task',async(data)=>{
      const { taskId, assignedUserId, user,actorId,message, projectId} = data;
      console.log('hehe', data)
      try{
        assignedUserId.forEach(userId => {
          if (userId !== actorId) {
            _io.to(`user-${userId}`).emit('notification', {
              user:user,
              message: message,
              taskId: taskId,
              projectId:projectId
            });
            console.log('Emitting to user room:', `user-${userId}`);

          }
        });
      } catch(error){
        socket.emit('error-comment', { message: 'Failed to save comment' });
      }
    })
    
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

  }
}
module.exports=Socket