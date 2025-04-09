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
        console.log(plainResult2)
        const result3= await Promise.all(plainResult2.map(task => db.TaskMember.findAll(
            {
                where: {
                  task_id: task.id,
                },
            },
        )))
        console.log(result3)
        const flatResult3 = result3.flat();
        const plainResult3 = flatResult3.map(task => task.get({ plain: true }))
        const result4 = await Promise.all(plainResult3.map(user => db.User.findByPk(user.user_id)))
        const plainResult4 =  result4.map(task => task.get({ plain: true }))  
        const mergedResult = plainResult2.map((member, index) => {
            return {
                ...member,
                user: {
                    id: plainResult4[index].id,
                    firstname: plainResult4[index].firstname,
                    lastname: plainResult4[index].lastname,
                    avatar: plainResult4[index].avatar
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
    getAllTaskByProjectId,
    updateTaskStatus,
    getTaskMember,
    getTodayTask
}