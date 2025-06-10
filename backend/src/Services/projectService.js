const { where } = require('sequelize')
const { Op } = require('sequelize');
const db =require('../Model/models')
const createProject=async(title, startDate, dueDate, assignedUserId)=>{
    try{
        const result=await db.Project.create({
            title:title,
            createdAt:startDate,
            endedAt:dueDate
        })
        const taskMembers = assignedUserId.map(member => ({
            projectId: result.id,
            userId:member.userId,
            role:member.role
        }));
        await Promise.all(taskMembers.map(user=>{
            if(user.role==='admin'){
               return db.ProjectMember.create({
                    projectId:user.projectId,
                    role:user.role,
                    userId:user.userId,
                    canEditProject:true,	
                    canDeleteProject:true,	
                    canCreateTask:true,	
                    canEditTask	: true,
                    canDeleteTask: true
                })
            } else if(user.role==='editor'){
                return db.ProjectMember.create({
                    projectId:user.projectId,
                    role:user.role,
                    userId:user.userId,
                    canEditProject:false,	
                    canDeleteProject:false,	
                    canCreateTask:true,	
                    canEditTask	: true,
                    canDeleteTask: true
                })
            }else if(user.role==='viewer'){
               return db.ProjectMember.create({
                    projectId:user.projectId,
                    role:user.role,
                    userId:user.userId,
                    canEditProject:false,	
                    canDeleteProject:false,	
                    canCreateTask:false,	
                    canEditTask	: false,
                    canDeleteTask: false
                })
            }
        }))
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const updateProject=async(userId, id,title, startDate, dueDate, assignedUserId, assignedRoles )=>{
    try{
        const checkRole=await db.ProjectMember.findOne({
            where:{
                userId:userId,
                projectId:id
            }
        })
        const plainResult=await checkRole.get({plain:true})
        if(plainResult.role==='admin'){
            // 1. Cập nhật thông tin Project
            const result = await db.Project.update(
                {
                    title: title,
                    createdAt: startDate,
                    endedAt: dueDate
                },
                {
                    where: {
                    id: id
                    }
                }
            );

            // 2. Xoá các thành viên không còn trong danh sách
            await db.ProjectMember.destroy({
                where: {
                    projectId: id,
                    userId: { [Op.notIn]: assignedUserId }
                }
            });

            // 3. Tìm các thành viên đã tồn tại
            const existing = await db.ProjectMember.findAll({
                where: { projectId: id }
            });
            const existingMemberIds = existing.map(row => row.userId);

            // 4. Tìm user mới để thêm
            const newMembers = assignedUserId
            .map((user_id, index) => ({ user_id, role: assignedRoles[index] }))
            .filter(({ user_id }) => !existingMemberIds.includes(user_id));

            // 5. Thêm các thành viên mới vào bảng ProjectMember
            await db.ProjectMember.bulkCreate(
                newMembers.map(({ user_id, role }) => ({
                    projectId: id,
                    userId: user_id,
                    role: role
                }))
            );

            // 6. Cập nhật role của thành viên đã tồn tại nếu khác với role mới
            for (const row of existing) {
                const index = assignedUserId.indexOf(row.userId);
                const newRole = assignedRoles[index];
                if (row.role !== newRole) {
                    row.role = newRole;
                    await row.save();
                }
            }

        } else{
            throw new Error(`User does not have permission to edit this task.`)
        }
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const getAllProject=async(userId)=>{
    try{
      const result1=await db.ProjectMember.findAll(
        {
            where:{
                userId:userId
            }
        }
      )
      const plainResult1=result1.map(project=>project.get({plain:true}))
      let result= await Promise.all(plainResult1.map(item=>db.Project.findOne(
        {
            where:{
                id:item.projectId
            }
        }
      )))
      const plainResult =await result.map(project => project.get({ plain: true }))  
      return plainResult
    } catch (error){
      throw new Error(`check error ${error}`)
    }
}
const getProjectById=async(id)=>{
    try{
        let result= await db.Project.findByPk(id)
        const plainResult =await result.get({ plain: true })  
        return plainResult
      } catch (error){
        throw new Error(`check error ${error}`)
      }
}
const getProjectProgress=async(projectId)=>{
    try{
        let result1= await db.Task.findAndCountAll(
            {
                where:{
                    project_id:projectId
                }
            }
        )
        let result2= await db.Task.findAndCountAll(
            {
                where:{
                    project_id:projectId,
                    status:'Complete'
                }
            }
        )
        let result3=await db.Project.findByPk(projectId)
        const plainResult =await result3.get({ plain: true })
        return {projectId:projectId, projectName:plainResult.title ,totalTask:result1.count, completeTask:result2.count}
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
const deleteProject=async(userId, projectId)=>{
    try{
        const checkRole=await db.ProjectMember.findOne({
            where:{
                userId:userId,
                projectId:projectId
            }
        })
        const plainResult=await checkRole.get({plain:true})
        if(plainResult.role==='admin'){
            await db.Project.destroy({
                where:{
                    id:projectId
                }
            })
        } else{
            throw new Error(`User does not have permission to edit this task.`)

        }
    } catch (error){
        throw new Error(`check error ${error}`)
    }
}
module.exports={
    createProject,
    getAllProject,
    getProjectProgress,
    getProjectById, 
    updateProject,
    deleteProject
}