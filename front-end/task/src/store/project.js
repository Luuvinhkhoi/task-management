import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const projectSlice= createSlice({
    name: 'projects',
    initialState:{
        projects:[],
    },
    reducers:{
        getProject:(state, action)=>{
            state.projects = action.payload
        },
    }
})
export const fetchProjects = createAsyncThunk(
      'project/getProject',
      async(_,thunkAPI) =>{
        const result = await task.getAllProject();
        await thunkAPI.dispatch(getProject(result)); // Chỉ setProject nếu component vẫn còn mounted
      }
);

export const {getProject}=projectSlice.actions
export default projectSlice.reducer