// CLASE USUARIO

class Usuario {
    constructor (name) {
        this.name = name
    }
}



// OBTENER ELEMENTOS

const tareasForm = document.getElementById ('form_tareas')
const tareasInput = document.getElementById ('input_tareas')
const tareasContainer = document.getElementById ('contenedor_tareas')
const usuarioSelect = document.getElementById ('user_select')
const usuarioForm = document.getElementById ('form_usuario')
const usuarioInput = document.getElementById ('input_usuario')



// CARGAR USUARIOS ALMACENADOS

const usuarios = JSON.parse (localStorage.getItem ('usuarios')) || []
let usuarioActual = null



// CARGAR TAREAS ALMACENADAS

const tareas = JSON.parse (localStorage.getItem ('tareas')) || []



// RENDERIZAR LOS USUARIOS

function renderUsuarios () {

    usuarioSelect.innerHTML = ''

    usuarios.forEach (usuario => {
        const opcion = document.createElement ('option')

        opcion.value = usuario.name
        opcion.textContent = usuario.name

        usuarioSelect.appendChild (opcion)
    })
}



// CAMBIAR DE USUARIO

function cambiarUsuario () {

    const seleccionarNombreUsuario = usuarioSelect.value
    
    usuarioActual = usuarios.find (usuario => usuario.name === seleccionarNombreUsuario)
    renderTareas ()
}



// RENDERIZAR TAREAS

function renderTareas () {

    tareasContainer.innerHTML = ''

    tareas
        .filter ((tarea) => tarea.usuario === usuarioActual.name)
        .forEach ((tarea, index) => {

            const tareaElement = document.createElement ('div')
            tareaElement.classList.add ('tarea')
            
            const tareaSpan = document.createElement ('span')
            tareaSpan.textContent = tarea.title
            tareaElement.appendChild (tareaSpan)

            const eliminarButton = document.createElement ('button')
            eliminarButton.classList.add ('btn_eliminar')
            eliminarButton.innerHTML = '<img src="Img/eliminar.png">'
            eliminarButton.addEventListener ('click', function () {
                eliminarTarea (index)
            })

            tareaElement.appendChild (eliminarButton)

            const editarButton = document.createElement ('button')
            editarButton.classList.add ('btn_editar')
            editarButton.innerHTML = '<img src="Img/editar.png">'
            editarButton.addEventListener ('click', function () {
                editarTarea (index)
            })

            tareaElement.appendChild (editarButton)

            tareasContainer.appendChild (tareaElement)
        })
}



// AGREGAR NUEVA TAREA

function agregarTarea (tarea) {

    tareas.push (tarea)
    localStorage.setItem ('tareas', JSON.stringify (tareas))

    renderTareas()
}



// ELIMINAR UNA TAREA

function eliminarTarea (index) {

    tareas.splice (index, 1)
    localStorage.setItem ('tareas', JSON.stringify (tareas))

    renderTareas()

    // LIBRERIA CONFETTI

    var count = 200
    var defaults = {
        origin: { y: 0.7 }
    }

    function fire(particleRatio, opts) {

    confetti (Object.assign ({}, defaults, opts, {
            particleCount: Math.floor (count * particleRatio)
        }))
    }

    fire (0.25, {
    spread: 26,
    startVelocity: 55,
    })
    fire (0.2, {
    spread: 60,
    })
    fire (0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
    })
    fire (0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
    })
    fire (0.1, {
    spread: 120,
    startVelocity: 45,
    })
}



// EDITAR TAREA

function editarTarea (index) {

    const tareaElement = tareasContainer.children[index]
    const tareaSpan = tareaElement.querySelector ('span')
    const editarForm = document.getElementById ('form_editar_tarea')
    const editarInput = document.getElementById ('input_editar_tarea')

    editarInput.value = tareaSpan.textContent
    
    editarForm.style.display = 'block'
    tareaElement.style.display = 'none'

    editarForm.addEventListener ('submit', function (e) {

        e.preventDefault()

        const nuevoTitulo = editarInput.value.trim()

        if (nuevoTitulo !== '') {

            tareas[index].title = nuevoTitulo
            localStorage.setItem ('tareas', JSON.stringify (tareas))

            editarForm.style.display = 'none'
            tareaElement.style.display = 'block'

            tareaSpan.textContent = nuevoTitulo
        }
    })
}



// AGREGAR NUEVO USUARIO

function agregarUsuario (usuario) {

    const nombreUsuario = usuarioInput.value.trim()

    if (nombreUsuario !== '') {

        const nuevoUsuario = new Usuario (nombreUsuario)
        agregarUsuarioSelect(nuevoUsuario)

        usuarioInput.value = ''
    }
}



// AGREGAR USUARIO AL SELECT

function agregarUsuarioSelect (usuario) {

    usuarios.push (usuario)
    localStorage.setItem ('usuarios', JSON.stringify (usuarios))

    renderUsuarios()

    usuarioActual = usuario
    renderTareas()
}



// MANEJAR EL ENVIO DE TAREAS

tareasForm.addEventListener ('submit', e => {

    e.preventDefault()
    const tareaTexto = tareasInput.value.trim()

    if (tareaTexto !== '') {

        const nuevaTarea = {
            title: tareaTexto,
            usuario: usuarioActual.name
        }

        agregarTarea (nuevaTarea)
        tareasInput.value = ''
    }
})



// MANEJAR ENVIO FORM USUARIOS

usuarioForm.addEventListener ('submit', e => {

    e.preventDefault()
    agregarUsuario (usuarioInput.value)
})



// MANEJAR CMABIO DE USUARIO

usuarioSelect.addEventListener ('change', cambiarUsuario)



// OBTENER TAREAS ARCHIVO JSON

fetch ('tareas.json')
    .then ((response) => response.json())
    
    .then ((data) => {

        tareas = data.tareas
        renderTareas()
    })

    .catch ((error) => {
        console.log ('Error al obtener las tareas: ', error)
    })


// CREAR USUARIOS INICIALES

if (usuarios.length === 0) {

    const defaultUsuario = [
        new Usuario ('Usuario 1'),
        new Usuario ('Usuario 2')
    ]

    defaultUsuario.forEach (usuario => agregarUsuario (usuario))
}


usuarioActual = usuarios[0]


renderUsuarios()