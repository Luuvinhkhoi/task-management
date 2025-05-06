const baseUrl='http://localhost:4001'
let task={
    signIn(email, password){
        return fetch(`${baseUrl}/auth/login`,{
            method:'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
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
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
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
            credentials: 'include'
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
            credentials: 'include'
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
            credentials:'include',
            headers: {
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
            credentials:'include',
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
            credentials:'include',
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
            credentials: 'include',
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
            credentials: 'include',
            headers: {
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
    createTask(title, description, status, priority, startDate, dueDate, assignedUserId, projectId){
        return fetch(`${baseUrl}/task`,{
            method:'POST',
            credentials: 'include',
            headers: {
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
            credentials: 'include',
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
            credentials: 'include',
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
            credentials: 'include',
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
            credentials: 'include',
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
            credentials: 'include',
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
            credentials: 'include',
            headers: {
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
    }
    ,
    getAllUser(){
        return fetch(`${baseUrl}/user`,{
            method:'GET',
            credentials: 'include',
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
            credentials: 'include',
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
          credentials: 'include',
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
            credentials: 'include',
            headers: {
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
            credentials:'include'
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
            credentials: 'include',
            headers: {
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
            credentials: 'include',
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
            credentials: 'include',
            headers: {
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
          credentials: 'include',
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
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json(); // Chờ và lấy dữ liệu trả về từ server
        });
    }
}
export default task