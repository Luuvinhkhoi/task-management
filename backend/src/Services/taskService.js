const { where } = require('sequelize');
const db =require('../Model/models')
const { Op } = require('sequelize');
const createTask=async(title, description, status, priority, assignedUserId, projectId,startDate, dueDate)=>{
    try{
        const result = await db.Task.create({
            project_id:projectId,
            title:title,
            description:description,
            status:status,
            priority:priority, 
            createdAt:startDate,
            endedAt:dueDate
        })
        const result2 ={ taskId: result.id,createdAt:result.createdAt}
        const taskMembers = assignedUserId.map(memberId => ({
            task_id: result2.taskId,
            user_id:memberId
        }));
        await db.TaskMember.bulkCreate(taskMembers);
        return result2
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const getAllTaskByProjectId=async(projectId)=>{
    try{
        let result=await db.Task.findAll(
            {
                where:{
                    project_id:projectId
                }
            }
        )
        const plainResult = await result.map(task => task.get({ plain: true }))    
        return plainResult
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
const getAllTaskByUserId=async(userId)=>{
    try{
        const result1=await db.TaskMember.findAll(
            {
                where:{
                    user_id:userId
                }
            }
        )
        const plainResult1 = result1.map(task => task.get({ plain: true }))
        const result2=await Promise.all(plainResult1.map(task=>db.Task.findByPk(task.task_id)))
        const plainResult2 = result2.map(task => task.get({ plain: true }))
        return plainResult2
    } catch(error){
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
const getTodayTask=async(userId)=>{
    try{
        const today = new Date();
        const result1=await db.TaskMember.findAll(
            {
                where: {
                  user_id: userId,
                },
            },
        )
        const plainResult1 = result1.map(task => task.get({ plain: true }))
        const result2 = await Promise.all(plainResult1.map(task => db.Task.findAll(
            {
                where: {
                  id: task.task_id,
                  createdAt: {
                    [Op.lte]: today,  // startDate <= today
                  },
                  endedAt: {
                    [Op.gte]: today,  // endDate >= today
                  },
                },
            }
        )))
        const flatTask=result2.flat()
        const plainResult2=flatTask.map(task=>task.get({plain:true}))
        const result3= await Promise.all(plainResult2.map(task => db.TaskMember.findAll(
            {
                where: {
                  task_id: task.id,
                },
            },
        )))
        const plainResult3 = result3.map(taskArr => taskArr.map(task=>task.get({ plain: true })))
        const result4 = await Promise.all(plainResult3.map(userArr=> Promise.all(userArr.map(user =>db.User.findByPk(user.user_id)))))
        const plainResult4 = result4.map(userArr =>
            userArr.map(user => user.get({ plain: true }))
        )
        const mergedResult = plainResult2.map((task, index) => {
            return {
                ...task,
                user: plainResult4[index].map(user=>({
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    avatar: user.avatar
                }))
            }
        })

        return mergedResult
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
const getUpcomingTask=async (userId)=>{
    try{
        const today = new Date();
        const result1=await db.TaskMember.findAll(
            {
                where: {
                  user_id: userId,
                },
            },
        )
        const plainResult1 = result1.map(task => task.get({ plain: true }))
        const result2 = await Promise.all(plainResult1.map(task => db.Task.findAll(
            {
                where: {
                  id: task.task_id,
                  createdAt: {
                    [Op.gte]: today,
                  },
                },
            }
        )))
        const flatTask=result2.flat()
        const plainResult2=flatTask.map(task=>task.get({plain:true}))
        const result3= await Promise.all(plainResult2.map(task => db.TaskMember.findAll(
            {
                where: {
                  task_id: task.id,
                },
            },
        )))
        const plainResult3 = result3.map(taskArr => taskArr.map(task=>task.get({ plain: true })))
        const result4 = await Promise.all(plainResult3.map(userArr=> Promise.all(userArr.map(user =>db.User.findByPk(user.user_id)))))
        const plainResult4 = result4.map(userArr =>
            userArr.map(user => user.get({ plain: true }))
        )
        const mergedResult = plainResult2.map((task, index) => {
            return {
                ...task,
                user: plainResult4[index].map(user=>({
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    avatar: user.avatar
                }))
            }
        })

        return mergedResult
    }catch(error){
        throw new Error(`check error ${error}`)
    }
}
const getTaskDetail=async (id)=>{
    try{
      const result= await db.Task.findAll(
        {
            where: {
                id: id,
            },
        }
      )
      const plainResult=await result.map(item=>item.get({plain:true}))
      const result1= await db.TaskMember.findAll(
        {
            where: {
              task_id: plainResult[0].id,
            },
        },
      )
      const plainResult2=await result1.map(result=>result.get({plain:true}))
      const result3=await Promise.all(plainResult2.map(item=>db.User.findByPk(item.user_id)))
      const plainResult3=await result3.map(result=>result.get({plain:true}))
      const result4=await db.Attachment.findAll(
        {
            where:{
                taskId: id
            }
        }
      )
      const plainResult4=await result4.map(result=>result.get({plain:true}))
      const mergedResult= plainResult.map((task, index) => {
        return {
            ...task,
            users: plainResult3.map(user=>({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar
            }))
        }
      })
      const mergedResult2=mergedResult.map(task=>{
        return{
            ...task,
            attachment: plainResult4.map(file=>({
                id:file.id,
                url: file.url,
                name:file.name
            }))
        }
      })

      return mergedResult2
    } catch(error){
      throw new Error(`check error ${error}`)
    }
}
const updateTaskDetail= async (userId,id, title ,status, priority, description, project_id,startDate, endDate, assignedUserId)=>{
    try{
        const checkRole=await db.ProjectMember.findOne({
            where:{
                userId:userId,
                projectId:project_id
            }
        })
        const plainResult=await checkRole.get({plain:true})
        if(plainResult.role!=='viewer'){
            const result= await db.Task.update(
            { project_id:project_id,
                title:title,
                status: status,
                priority:priority,
                description:description,
                createdAt:startDate, 
                endedAt:endDate
            },
            {
                where: {
                    id: id,
                },
            }
            )
            await db.TaskMember.destroy({
                where: {
                    task_id: id,
                    user_id: { [Op.notIn]: assignedUserId} 
                }
            })
            const existing = await db.TaskMember.findAll({
                where: { task_id: id }
            });
            const existingMemberIds = existing.map(row => row.user_id);
            const newMembers = assignedUserId.filter(id => !existingMemberIds.includes(id));
            await db.TaskMember.bulkCreate(
                newMembers.map(user_id => ({
                task_id: id,
                user_id,
                }))
            );
        } else{
            throw new Error(`User does not have permission to edit this task.`)
        }
    } catch(error){
        throw new Error(`check error ${error}`)
    }
}
const deleteTask=async(userId,id)=>{
    try{
        const checkProjectId=await db.Task.findByPk(id)
        const plainResult2=await checkProjectId.get({plain:true})
        const checkRole=await db.ProjectMember.findOne({
            where:{
                userId:userId,
                projectId:plainResult2.project_id
            }
        })
        const plainResult=await checkRole.get({plain:true})
        if(plainResult.role!=='viewer'){
            const result=await db.Task.destroy(
                {
                    where:{
                        id: id
                    }
                }
            )
            await db.Notification.destroy(
                {
                    where:{
                        taskId:id
                    }
                }
            )
            
        } else{
            throw new Error(`User does not have permission to edit this task.`)
        }
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
module.exports={
    createTask,
    getAllTaskByProjectId,
    updateTaskStatus,
    getTaskMember,
    getTodayTask, 
    getUpcomingTask,
    getAllTaskByUserId,
    getTaskDetail,
    updateTaskDetail,
    deleteTask
}