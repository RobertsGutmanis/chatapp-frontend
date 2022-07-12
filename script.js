//views
const view_login = document.querySelector(".login");
const view_register = document.querySelector(".register");
const view_chat = document.querySelector(".chatapp");

//goto btns
const goto_register = document.querySelector("#a-reg");
const goto_login = document.querySelector("#a-login");
const goto_logout = document.querySelector("#logout")

//forms
const form_login = document.querySelector("#login-form");
const form_register = document.querySelector("#register-form");
const form_message = document.querySelector("#message-form")

//data
const data_login = document.querySelectorAll(".login-input");
const data_register = document.querySelectorAll(".register-input");
const data_message = document.querySelector("#chat-input")

//vars
let login_values = [];
let register_values = [];
//GET messages
const get_message = async (token) =>{
    const fetchReq = await fetch(`https://rg-chat-backend.herokuapp.com/api/messages`,{
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${token}`
        })
    })
    const awaitFetch = await fetchReq.json()
    messages.innerHTML = "";
    console.log(awaitFetch)
    const reveresedArr = awaitFetch.messages.reverse()
    reveresedArr.forEach((e)=>{
        if(e.sender == localStorage.getItem("name")){
            messages.insertAdjacentHTML(`beforeend`, `
                <div class="messagebox-self">
                    <div class="message-self">
                        <div class="sender">${e.sender}</div>
                        <div class="text">${e.message}</div>
                        <div class="date">${e.created_at}</div>
                    </div>
                </div>
            `)
        }else{
            messages.insertAdjacentHTML(`beforeend`, `
            <div class="messagebox">
                <div class="message">
                    <div class="sender">${e.sender}</div>
                    <div class="text">${e.message}</div>
                    <div class="date">${e.created_at}</div>
                </div>
            </div>
        `)
        }
    })
}

if(localStorage.getItem("token")){
    view_login.style.display="none";
    view_chat.style.display="inline";
}

const messages = document.querySelector(".messages");
//Change views
goto_register.addEventListener("click", ()=>{
    view_login.style.display = "none";
    view_register.style.display = "inline";
})
goto_login.addEventListener("click", ()=>{
    view_login.style.display = "inline";
    view_register.style.display = "none";
})

//Submit forms
form_login.addEventListener("submit", (e)=>{
    e.preventDefault()
    data_login.forEach((e)=>{
        login_values.push(e.value)
        e.value = ""
    })
    login_func(login_values[0], login_values[1])
    login_values = [];
})
form_register.addEventListener("submit", (e)=>{
    e.preventDefault()
    data_register.forEach((e)=>{
        register_values.push(e.value)
        e.value=""
    })
    register_func(register_values[0], register_values[1],register_values[2],register_values[3])
})
const register_func = async (name, email, password, password_confirmation)=>{
    const fetchReq = await fetch('https://rg-chat-backend.herokuapp.com/api/register', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({"name": name, "email": email, "password": password, "password_confirmation": password_confirmation}),
    }) 
    const awaitFetch = await fetchReq.json();
    if(awaitFetch.user){
        alert("Registered!")
        view_register.style.display = "none";
        view_login.style.display = 'inline';
    }else{
        alert("Incorrect data!")
    }

}

//Login func
const login_func = async (email, password) =>{
    const fetchReq = await fetch('https://rg-chat-backend.herokuapp.com/api/login', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({"email":email, "password": password}),
    }) 
    let awaitFetch = await fetchReq.json()
    if(awaitFetch.token){
        localStorage.setItem("token", awaitFetch.token);
        localStorage.setItem("name", awaitFetch.user.name);
        view_login.style.display = "none";
        view_chat.style.display = "inline";
        get_message(localStorage.getItem("token"))
    }else{
        alert("Bad login")
    }
}

const sendmessage_func = async (message) =>{
    const fetchReq = await fetch('https://rg-chat-backend.herokuapp.com/api/messages', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({"sender":localStorage.getItem("name"), "message": message}),
    }) 
    const awaitFetch = await fetchReq.json()
    get_message(localStorage.getItem("token"))
}
form_message.addEventListener("submit", (e)=>{
    e.preventDefault()
    sendmessage_func(data_message.value)
    data_message.value = ""
})
goto_logout.addEventListener("click", async function(){
    const fetchReq = await fetch('https://rg-chat-backend.herokuapp.com/api/logout', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    })
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    messages.innerHTML = ""
    view_chat.style.display="none";
    view_login.style.display="inline";
})