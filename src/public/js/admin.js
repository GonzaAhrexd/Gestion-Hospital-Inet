const pacientesSection = document.getElementById('pacientes')
const medicosSection = document.getElementById('Medicos')
const adminsSection = document.getElementById('Administradores')
const ZonasSection = document.getElementById('Zonas')
console.log(medicosSection)
function pacientes(){
    pacientesSection.style.display = 'block'
    medicosSection.style.display = 'none'
    adminsSection.style.display = 'none'
    ZonasSection.style.display = 'none'
}

function medicos(){
    console.log("hola")
    pacientesSection.style.display = 'none'
    medicosSection.style.display = 'block'
    adminsSection.style.display = 'none'
    ZonasSection.style.display = 'none'
}
function admins(){
    pacientesSection.style.display = 'none'
    medicosSection.style.display = 'none'
    adminsSection.style.display = 'block'
    ZonasSection.style.display = 'none'
}
function Zonas(){
    pacientesSection.style.display = 'none'
    medicosSection.style.display = 'none'
    adminsSection.style.display = 'none'
    ZonasSection.style.display = 'block'
}