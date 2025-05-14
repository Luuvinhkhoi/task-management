import { configureStore } from "@reduxjs/toolkit"
import userSliceReducer from './userProfile'
import taskSliceReducer from './task'
import settingSliceReducer from './setting'
import projectSliceReducer from './project'
import todayTasksSliceReducer from './todayTask'
import upcomingTasksSliceReducer from './upcomingTask'
export const store = configureStore({
    reducer: {
      // Define a top-level state field named `todos`, handled by `todosReducer`
      userProfile:userSliceReducer,
      projects:projectSliceReducer,
      tasks:taskSliceReducer,
      setting:settingSliceReducer,
      todayTasks:todayTasksSliceReducer,
      upcomingTasks:upcomingTasksSliceReducer
    }
})
