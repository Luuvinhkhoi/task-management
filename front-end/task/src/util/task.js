import { getJWT } from '../auth/getJWT'
const baseUrl=
  import.meta.env.MODE=== "development"
    ? import.meta.env.VITE_BASE_URL_DEV
    : import.meta.env.VITE_BASE_URL_PROD;
let task={
    async signIn(email, password){
        const token = await getJWT();
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
    async signUp(email, password, firstname, lastname){
        const token = await getJWT();
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
    async getUserProfile(){
        const token = await getJWT();
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
    async logOut(){
        const token = await getJWT();
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
    async createProject(title, assignedUserId){
        const token = await getJWT();
        return fetch(`${baseUrl}/project`,{
            method:'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                title,
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
    async getAllProject(){
        const token = await getJWT();
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
    async getProjectById(id){
        const token = await getJWT();
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
    async getProjectProgress(){
        const token = await getJWT();
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
    async updateProject(updateData){
        const token = await getJWT();
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
    async deleteProject(id){
        const token = await getJWT();
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
    async createTask(title, description, status, priority, startDate, dueDate, assignedUserId, projectId){
        const token = await getJWT();
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
    async getAllTask(id){
        const token = await getJWT();
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
    async getTaskDetail(id){
        const token = await getJWT();
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
    async getTodayTask(){
        const token = await getJWT();
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
    async getUpcomingTask(){
        const token = await getJWT();
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
    async getAllTaskForUser(){
        const token = await getJWT();
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
    async updateTaskStatus(task){
        const token = await getJWT();
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
    async deleteTask(id){
        const token = await getJWT();
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
    async getAllUser(){
        const token = await getJWT();
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
    async getUserByProjectId(projectId){
        const token = await getJWT();
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
    async uploadAvatar(file){
        const token = await getJWT();
        const formData = new FormData();
        formData.append('image', file);
        return fetch(`${baseUrl}/upload/image`, {
          method: 'POST',
          headers:{
                'Authorization': `Bearer ${token}`,
          },
          body: formData, // Gửi FormData với dữ liệu file
          
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    async updateProfile(updateData){
        const token = await getJWT();
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
    async getSetting(){
        const token = await getJWT();
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
    async updateUserSetting(updateData){
        const token = await getJWT();
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
    async getPresignedUrl(key){
        const token = await getJWT();
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
    async deleteAttachment(key, id){
        const token = await getJWT();
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
    async uploadAttachment(file, id){
        const token = await getJWT();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('task_id', id)
        return fetch(`${baseUrl}/upload/file`, {
          method: 'POST',
          headers:{
                'Authorization': `Bearer ${token}`,
          },
          body: formData, // Gửi FormData với dữ liệu file
          
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    async updateTaskDetail(updateData){
        const token = await getJWT();
        return fetch(`${baseUrl}/task`, {
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
    async getComment(taskId){
        const token = await getJWT();
        return fetch(`${baseUrl}/comment/${taskId}`, {
            method: 'GET',
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
    async createNewComment(data){
        const token = await getJWT();
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
    async search(query){
        const token = await getJWT();
        return fetch(`${baseUrl}/search?${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
          }).then(response => {
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    },
    async createNoti(data){
        const token = await getJWT();
        return fetch(`${baseUrl}/notification`, {
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
    async getAllNoti(){
        const token = await getJWT();
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
    async updateNoti(data){
        const token = await getJWT();
        return fetch(`${baseUrl}/notification`, {
            method: 'PATCH',
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
    async getUserRole(projectId){
        const token = await getJWT();
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
    async getAllUserRole(){
        const token = await getJWT();
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