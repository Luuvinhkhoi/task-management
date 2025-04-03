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
    signUp(email, password, userName){
        return fetch(`${baseUrl}/auth/signUp`,{
            method:'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username:userName
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
    createProject(title, startDate, endDate){
        return fetch(`${baseUrl}/project`,{
            method:'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                title,
                startDate,
                endDate
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
    getAllTask(){
        return fetch(`${baseUrl}/task`,{
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
    updateTaskStatus(id, status){
        return fetch(`${baseUrl}/task`,{
            method:'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id, 
                status
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
    }

}
export default task