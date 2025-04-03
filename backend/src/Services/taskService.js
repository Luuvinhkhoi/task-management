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
        console.log(result)
        const plainResult = await result.map(task => task.get({ plain: true }))    
        console.log(plainResult)
        return plainResult
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
const updateTaskStatus=async(id, status)=>{
    try{
        let result=db.Task.Update(
            { status: status },
            {
                where: {
                  id: id,
                },
            },
        )
        const plainResult =await result.map(project => project.get({ plain: true }))    
        console.log(plainResult)
        return plainResult
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
module.exports={
    createTask,
    getAllTask,
    updateTaskStatus
}