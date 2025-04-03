import { configureStore } from "@reduxjs/toolkit"
import userSliceReducer from './userProfile'
import taskSliceReducer from './task'
export const store = configureStore({
    reducer: {
      // Define a top-level state field named `todos`, handled by `todosReducer`
      userProfile:userSliceReducer,
      tasks:taskSliceReducer,
    }
})
