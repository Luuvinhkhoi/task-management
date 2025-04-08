const db =require('../Model/models')
const createTask=async(title, description, status, priority, assignedUserId, projectId,startDate, dueDate)=>{
    try{
        const result = await db.Task.create({
            project_id:projectId,
            title:title,
            description:description,
            status:status,
            priority:priority, 
            createdAt:startDate,
            endAt:dueDate
        })
        const taskId = result.id;
        const taskMembers = assignedUserId.map(memberId => ({
            task_id: taskId,
            user_id:memberId
        }));
        console.log(taskMembers)
        await db.TaskMember.bulkCreate(taskMembers);
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const getAllTask=async()=>{
    try{
        let result=await db.Task.findAll()
        const plainResult = await result.map(task => task.get({ plain: true }))    
        return plainResult
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
const updateTaskStatus=async(id, status)=>{
    try{
        const [updatedRows]= await db.Task.update(
            { status: status },
            {
                where: {
                  id: id,
                },
            },
        )
        if (updatedRows === 0) {
            throw new Error(`No task found with id: ${id}`);
        }

        // Tìm lại task đã được cập nhật
        const updatedTask = await db.Task.findOne({ where: { id } });

        return updatedTask;
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
const getTaskMember=async(taskId)=>{
    try{
        const result1= await db.TaskMember.findAll(
            {
                where: {
                  task_id: taskId,
                },
            },
        )
        const plainResult1 = result1.map(task => task.get({ plain: true }))
        const result2 = await Promise.all(plainResult1.map(user => db.User.findByPk(user.user_id)))
        const plainResult2 =  result2.map(task => task.get({ plain: true }))  
        const mergedResult = plainResult1.map((member, index) => {
            return {
                ...member,
                user: {
                    id: plainResult2[index].id,
                    firstname: plainResult2[index].firstname,
                    lastname: plainResult2[index].lastname,
                    avatar: plainResult2[index].avatar
                }
            }
        })
        return mergedResult
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
module.exports={
    createTask,
    getAllTask,
    updateTaskStatus,
    getTaskMember
}