import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const taskSlice= createSlice({
    name: 'tasks',
    initialState:{
        hasUnsavedChanges: false,
        tasks:[],
        members:[]
    },
    reducers:{
        getTask:(state, action)=>{
            state.tasks = action.payload.tasks
            state.members = action.payload.members
        },
        updateItem:(state, action)=>{
            const task=action.payload
            const existingItem=state.tasks.find(item=>item.id===task.id)
            if(existingItem){
               existingItem.status=task.status
               existingItem.isModified = true;
               state.hasUnsavedChanges=true
            } else{
            }
        },
    }
})
export const getAllTask=createAsyncThunk(
    'task/getTask',
    async(id,thunkAPI)=>{
        const result=await task.getAllTask(id)
        await thunkAPI.dispatch(getTask({
            tasks: result.tasks,
            members: result.members
        }))
    }
)
export const updateTaskStatus=createAsyncThunk(
    'task/updateTaskStatus',
    async(tasks,thunkAPI)=>{
        console.log(tasks)
        const result=await task.updateTaskStatus(tasks)
    }
)
export const {getTask, updateItem, getMember}=taskSlice.actions
export default taskSlice.reducer