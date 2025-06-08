import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const progressSlice= createSlice({
    name: 'progress',
    initialState:{
        progress:[],
    },
    reducers:{
        getProgress:(state, action)=>{
            state.progress = action.payload
        },
    }
})
export const fetchProgress = createAsyncThunk(
      'project/getProject',
      async(_,thunkAPI) =>{
        const result = await task.getProjectProgress();
        if(result){
            thunkAPI.dispatch(getProgress(result)); // Chỉ setProject nếu component vẫn còn mounted
        }
      }
);

export const {getProgress}=progressSlice.actions
export default progressSlice.reducer