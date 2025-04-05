import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import task from "../util/task";
const userSlice= createSlice({
    name: 'userProfile',
    initialState:{
        email:'',
        firstname:'',
        lastname:'',
        avatar:'',
        phone:'',
    },
    reducers:{
        getUserProfile:(state, action)=>{
            state.firstname=action.payload.firstname,
            state.lastname=action.payload.lastname,
            state.email=action.payload.email,
            state.avatar=action.payload.avatar,
            state.phone=action.payload.phonenumber
        }
    }
})
export const getProfile=createAsyncThunk(
    'profile/getUserProfile',
    async(_,thunkAPI)=>{
        const result=await task.getUserProfile()
        thunkAPI.dispatch(getUserProfile(result))
    }
)
export const {getUserProfile}=userSlice.actions
export default userSlice.reducer