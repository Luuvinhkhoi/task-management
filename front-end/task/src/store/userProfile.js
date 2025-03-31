import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const userSlice= createSlice({
    name: 'userProfile',
    initialState:{
        userName:''
    },
    reducers:{
        getUserProfile:(state, action)=>{
            state.userName=action.payload
        }
    }
})
export const getProfile=createAsyncThunk(
    'profile/getUserProfile',
    async(_,thunkAPI)=>{
        const result=await task.getUserProfile()
        thunkAPI.dispatch(getUserProfile(result.user_name))
    }
)
export const {getUserProfile}=userSlice.actions
export default userSlice.reducer