const login = document.getElementById('login')

const register = document.getElementById('register')

const cambiar = document.getElementById('cambiar')
const cambiar2 = document.getElementById('cambiar2')
// cambiar.addEventListener('click', console.log("hola"))
cambiar.addEventListener('click', change)
cambiar2.addEventListener('click', change2)
function change(){
    login.style.display = 'none'
    register.style.display = 'block'
}
function change2(){
    register.style.display = 'none'
    login.style.display = 'block'
}
