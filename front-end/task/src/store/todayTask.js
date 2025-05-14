import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const todayTaskSlice= createSlice({
    name: 'todayTasks',
    initialState:{
        tasks:[],
    },
    reducers:{
        getTask:(state, action)=>{
            state.tasks = action.payload
        },
    }
})
export const getAllTodayTask=createAsyncThunk(
    'task/getTask',
    async(_,thunkAPI)=>{
        const result=await task.getTodayTask()
        thunkAPI.dispatch(getTask(result))
    }
)

export const {getTask}=todayTaskSlice.actions
export default todayTaskSlice.reducer