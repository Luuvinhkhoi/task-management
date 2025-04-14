import './kanban.css';
import React, { use, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTask, updateTaskStatus } from '../../../../store/task';
import { updateItem } from '../../../../store/task';
const ItemType = "KANBAN_ITEM";

export const Kanban = () => {
    const { t } = useTranslation();
    const { id } = useParams()
    const dispatch=useDispatch()
    const location=useLocation()
    const tasks=useSelector((state)=>state.tasks.tasks)
    const taskMembers=useSelector((state)=>state.tasks.members)
    console.log(taskMembers)
    const hasUnsavedChanges = useSelector(state => state.tasks.hasUnsavedChanges);
    // Hàm di chuyển item khi kéo thả
    const moveItem = (id, newStatus) => {
        try{
          dispatch(updateItem({id: id,status: newStatus}))
        } catch(error){
          console.log(error)
        }
    };
    useEffect(()=>{
      async function fetchTask(){
        try{
          await dispatch(getAllTask(id))
        } catch(error){
          console.log(error)
        }
      }
      fetchTask()
    }, [id])
    useEffect(() => {
            // Lưu URL hiện tại để theo dõi trang
            const currentPath = location.pathname;
    
            // Function gửi cart lên server
            const saveTask = async () => {
                if (hasUnsavedChanges) {
                    console.log(tasks)
                    const updatedTasks = tasks.filter(task=>task.isModified)
                    console.log(updatedTasks)
                    if (updatedTasks.length > 0) {
                       await dispatch(updateTaskStatus(updatedTasks)); 
                    }
                    console.log("Cart data saved!");
                }
            };
    
            // Xử lý khi tải lại trang hoặc đóng tab
            const handleBeforeUnload = (event) => {
                if (hasUnsavedChanges) {
                    saveTask();
                }
            };
    
            // Xử lý back/forward trên trình duyệt
            const handlePopState = () => {
                if (currentPath === "/project") {
                    saveTask();
                }
            };
    
            // Đăng ký event listeners
            window.addEventListener("beforeunload", handleBeforeUnload);
            window.addEventListener("popstate", handlePopState);
    
            // Cleanup function
            return () => {
                saveTask(); // Lưu lại trước khi component unmount
                window.removeEventListener("beforeunload", handleBeforeUnload);
                window.removeEventListener("popstate", handlePopState);
            };
    }, [location.pathname, dispatch, hasUnsavedChanges, tasks]);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="kanban">
                {/* To Do Column */}
                <KanbanColumn 
                    status="To do" 
                    title={t('kanban.todo')} 
                    tasks={tasks}
                    taskMembers={taskMembers}
                    moveItem={moveItem}
                    borderColor=" #007bff" 
                />

                {/* In Progress Column */}
                <KanbanColumn 
                    status="In progress" 
                    title={t('kanban.inProgress')} 
                    tasks={tasks}
                    taskMembers={taskMembers}
                    moveItem={moveItem}
                    borderColor="#f59e0b" 
                />

                {/* Complete Column */}
                <KanbanColumn 
                    status="Complete" 
                    title={t('kanban.complete')} 
                    tasks={tasks}
                    taskMembers={taskMembers}
                    moveItem={moveItem}
                    borderColor="rgb(50, 213, 131)" 
                />
            </div>
        </DndProvider>
    );
};

// Định nghĩa KanbanColumn bên ngoài Kanban nhưng vẫn trong cùng file
const KanbanColumn = ({ status, title, tasks,taskMembers, moveItem, borderColor }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemType,
        drop: (item) => moveItem(item.id, status),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });
    console.log(tasks)
    console.log(taskMembers)
    const filteredTasks = tasks.filter(task => task.status === status);
    const mergeTask=filteredTasks.map((task)=>{
        const members = taskMembers.find(memberGroup => 
            memberGroup[0]?.task_id === task.id
          ) || []
        
        return {
            ...task,
            members: members.map(mem => ({
              firstname: mem.user.firstname,
              lastname: mem.user.lastname,
              avatar: mem.user.avatar,
            }))
        }
    })  
    return (
        <div 
            className="kanbanColumn" 
            ref={drop}
            style={{ backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : '' }}
        >
            <div className="kanbanHeader" style={{borderLeft: `1rem solid ${borderColor}`}}>
                {title}
            </div>
            {mergeTask.map((task) => (
                <KanbanItem key={task.id} task={task} />
            ))}
        </div>
    );
};

// Định nghĩa KanbanItem bên ngoài Kanban nhưng vẫn trong cùng file
const KanbanItem = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div 
            ref={drag} 
            className="kanbanItem" 
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className={`priority-${task.priority.toLowerCase()}`} style={{display:'inline-block'}}>{task.priority}</div>
            <p>{task.title}</p>
            <span>{task.description}</span>
            <div className="member" style={{display:'flex', gap:'1rem'}}>
                {task.members.map(member=>
                     <div>
                        <img src={member.avatar? member.avatar:'https://cdn-icons-png.flaticon.com/512/3686/3686930.png'} alt="Avatar" />
                    </div>
                )}
            </div>
        </div>
    );
};