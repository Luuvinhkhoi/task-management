import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const upcomingTaskSlice= createSlice({
    name: 'upcomingTasks',
    initialState:{
        tasks:[],
    },
    reducers:{
        getTask:(state, action)=>{
            state.tasks = action.payload
        },
    }
})
export const getAllUpcomingTask=createAsyncThunk(
    'task/getUpcomingTask',
    async(_,thunkAPI)=>{
        const result=await task.getUpcomingTask()
        thunkAPI.dispatch(getTask(result))
    }
)

export const {getTask}=upcomingTaskSlice.actions
export default upcomingTaskSlice.reducer