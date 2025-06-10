class Socket {
  static async connection(socket) {
    socket.join(`user-${socket.user}`);
    socket.on('join-task', (roomName) => {
      socket.join( `task-${roomName}`);
      });
    socket.on('leave-room', (taskId) => {
      socket.leave(`task-${taskId}`);
    });
    socket.on('new-comment', async (data) => {
      try {
        // Gửi lại comment mới cho tất cả client
        _io.to(`task-${data.taskId}`).emit('receive-comment', data);
        data.assignedUserId.forEach(userId => {
          if (userId !== data.actorId) {
            _io.to(`user-${userId}`).emit('notification', {
              comment: data.content,
              id:data.notiId,
              user:data.user,
              message: data.message,
              taskId: data.taskId,
              createdAt:data.createdAt,
              projectId:data.projectId
            });
          }
        });
      } catch (err) {
        console.error('Error saving comment:', err.message);
        socket.emit('error-comment', { message: 'Failed to save comment' });
      }
    });
    socket.on('new-task',async(data)=>{
      const {notiId, taskId, assignedUserId, user,actorId,message, projectId, createdAt} = data;
      try{
        assignedUserId.forEach(userId => {
          if (userId !== actorId) {
            _io.to(`user-${userId}`).emit('notification', {
              id:notiId,
              user:user,
              message: message,
              taskId: taskId,
              createdAt:createdAt,
              projectId:projectId
            });

          }
        });
      } catch(error){
        socket.emit('error-comment', { message: 'Failed to save comment' });
      }
    })
    socket.on('new-update', async (data) => {
      const {notiId, taskId, assignedUserId, user,actorId,message, projectId, createdAt} = data;
      try{
        assignedUserId.forEach(userId => {
          if (userId !== actorId) {
            _io.to(`user-${userId}`).emit('notification', {
              id:notiId,
              user:user,
              message: message,
              taskId: taskId,
              createdAt:createdAt,
              projectId:projectId
            });

          }
        });
      } catch(error){
        socket.emit('error-comment', { message: 'Failed to save comment' });
      }
    })
    socket.on('disconnect', () => {
    });

  }
}
module.exports=Socket