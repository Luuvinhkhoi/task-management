import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const taskSlice= createSlice({
    name: 'tasks',
    initialState:{
        hasUnsavedChanges: false,
        task:[]
    },
    reducers:{
        getTask:(state, action)=>{
            state.task=action.payload
        },
        updateItem:(state, action)=>{
            const task=action.payload
            console.log(task)
            console.log(state)
            const existingItem=state.task.find(item=>item.status===task.status)
            if(existingItem){
               existingItem.status=task.status
               state.hasUnsavedChanges=true
            } else{
            }
        },
    }
})
export const getAllTask=createAsyncThunk(
    'task/getTask',
    async(_,thunkAPI)=>{
        const result=await task.getAllTask()
        thunkAPI.dispatch(getTask(result))
    }
)
export const updateTaskStatus=createAsyncThunk(
    'task/updateTaskStatus',
    async({id, status},thunkAPI)=>{
        console.log(id, status)
        const result=await task.updateTaskStatus(id, status)
    }
)
export const {getTask, updateItem}=taskSlice.actions
export default taskSlice.reducer