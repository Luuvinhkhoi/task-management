import { fetchAuthSession } from 'aws-amplify/auth';

const getJWT = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString(); // hoặc accessToken
    return idToken;
  } catch (error) {
    console.error('Cannot fetch JWT:', error);
    return null;
  }
};
const token = await getJWT();
const baseUrl=
  import.meta.env.MODE=== "development"
    ? import.meta.env.VITE_BASE_URL_DEV
    : import.meta.env.VITE_BASE_URL_PROD;
console.log('BASE_URL:', import.meta.env.VITE_BASE_URL_DEV);
let task={
    signIn(email, password){
        return fetch(`${baseUrl}/auth/login`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            console.log(response);
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    signUp(email, password, firstname, lastname){
        return fetch(`${baseUrl}/auth/signUp`,{
            method:'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            }),
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            console.log(response);
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getUserProfile(){
        return fetch(`${baseUrl}/auth`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    logOut(){
        return fetch(`${baseUrl}/auth/logout`,{
            method:'POST',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    createProject(title, startDate, endDate, assignedUserId){
        return fetch(`${baseUrl}/project`,{
            method:'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                title,
                startDate,
                endDate, 
                assignedUserId
            })
        }).then(response=>{
            if(response.ok){
                return response.json()
            }
            throw new Error (`Request failed with ${response.status}`)
        }).then(jsonResponse=>{
            if (!jsonResponse) {
                console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    }
    ,
    getAllProject(){
        return fetch(`${baseUrl}/project`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response=>{
            if(response.ok){
                return response.json()
            }
            throw new Error (`Request failed with ${response.status}`)
        }).then(jsonResponse=>{
            if (!jsonResponse) {
                console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getProjectById(id){
        return fetch(`${baseUrl}/project/${id}`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response=>{
            if(response.ok){
                return response.json()
            }
            throw new Error (`Request failed with ${response.status}`)
        }).then(jsonResponse=>{
            if (!jsonResponse) {
                console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getProjectProgress(){
        return fetch(`${baseUrl}/project/progress`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    }
    ,
    updateProject(updateData){
        return fetch(`${baseUrl}/project`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                updateData
            })
        }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    deleteProject(id){
        return fetch(`${baseUrl}/project/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    createTask(title, description, status, priority, startDate, dueDate, assignedUserId, projectId){
        return fetch(`${baseUrl}/task`,{
            method:'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description, 
                status, 
                priority,
                assignedUserId,
                projectId,
                startDate,
                dueDate,
            }),
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getAllTask(id){
        return fetch(`${baseUrl}/task/project/${id}`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getTaskDetail(id){
        return fetch(`${baseUrl}/task/${id}`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    }
    ,
    getTodayTask(){
        return fetch(`${baseUrl}/task/today`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getUpcomingTask(){
        return fetch(`${baseUrl}/task/upcoming`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getAllTaskForUser(){
        return fetch(`${baseUrl}/task/user`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    }
    ,
    updateTaskStatus(task){
        return fetch(`${baseUrl}/task`,{
            method:'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task
            }),
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    deleteTask(id){
        return fetch(`${baseUrl}/task/${id}`,{
            method:'DELETE',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        })
    }
    ,
    getAllUser(){
        return fetch(`${baseUrl}/user`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    getUserByProjectId(projectId){
        return fetch(`${baseUrl}/user/${projectId}`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    uploadAvatar(file){
        const formData = new FormData();
        formData.append('image', file);
        return fetch(`${baseUrl}/upload/image`, {
          method: 'POST',
          headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
          },
          body: formData, // Gửi FormData với dữ liệu file
          
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    updateProfile(updateData){
        return fetch(`${baseUrl}/user`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                updateData
            })
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
          });
    },
    getSetting(){
        return fetch(`${baseUrl}/setting`,{
            method:'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        }).then(response=>{
            if(response.ok){
               return response.json();
            }
            throw new Error(`Request failed with ${response.status}`);
        }).then(jsonResponse => {
            if (!jsonResponse) {
              console.error('Response error');
            }
            return jsonResponse;
        }).catch(networkError => {
            console.log(networkError.message);
        });
    },
    updateUserSetting(updateData){
        return fetch(`${baseUrl}/setting`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                updateData
            })
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
          });
    },
    getPresignedUrl(key){
        return fetch(`${baseUrl}/s3/download/${key}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); 
          });
    },
    deleteAttachment(key, id){
        return fetch(`${baseUrl}/s3/delete/${key}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id: id
            })
        }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); 
        });
    }
    ,
    uploadAttachment(file, id){
        const formData = new FormData();
        formData.append('file', file);
        formData.append('task_id', id)
        return fetch(`${baseUrl}/upload/file`, {
          method: 'POST',
          headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
          },
          body: formData, // Gửi FormData với dữ liệu file
          
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    updateTaskDetail(updateData){
        return fetch(`${baseUrl}/task`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                updateData
            })
        }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    getComment(taskId){
        return fetch(`${baseUrl}/comment/${taskId}`, {
            method: 'GET',
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    createNewComment(data){
        return fetch(`${baseUrl}/comment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    search(query){
        return fetch(`${baseUrl}/search?${query}`, {
            method: 'GET',
            credentials: 'include'
          }).then(response => {
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    createNoti(data){
        return fetch(`${baseUrl}/notification`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    getAllNoti(){
        return fetch(`${baseUrl}/notification`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    updateNoti(data){
        return fetch(`${baseUrl}/notification`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    getUserRole(projectId){
        return fetch(`${baseUrl}/user/role/${projectId}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    getAllUserRole(){
        return fetch(`${baseUrl}/user/role`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`,
            }
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    }
}
export default task