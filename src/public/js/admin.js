const pacientesSection = document.getElementById('pacientes')
const medicosSection = document.getElementById('Medicos')
const adminsSection = document.getElementById('Administradores')

console.log(medicosSection)
function pacientes(){
    pacientesSection.style.display = 'block'
    medicosSection.style.display = 'none'
    adminsSection.style.display = 'none'
}

function medicos(){
    console.log("hola")
    pacientesSection.style.display = 'none'
    medicosSection.style.display = 'block'
    adminsSection.style.display = 'none'
}
function admins(){
    pacientesSection.style.display = 'none'
    medicosSection.style.display = 'none'
    adminsSection.style.display = 'block'
}