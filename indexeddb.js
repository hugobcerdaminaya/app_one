
//***********************/
//Example use indexed db  

const indexedDB = window.indexedDB
const form = document.getElementById("form")
const esquemas = document.getElementById("esquemas")
let id = 1
if(indexedDB && form){
    let db
    const request = indexedDB.open('EsquemasBD', 1)
    request.onsuccess = () =>{
        db = request.result
        console.log('OPEN', db)
        readData()
    }

    request.onupgradeneeded = () =>{
        db = request.result
        console.log('CREATE', db)
        const objectSore = db.createObjectStore('esquemas',{keyPath:"id"})
    }

    request.onerror = (error) =>{
        console.log('Error'. error)
    }

    const addData = (data) => {
        const transaction = db.transaction(['esquemas'],'readwrite')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.add(data);
        readData()
    }

    const getData = (key) => {
        console.log(key)
        const transaction = db.transaction(['esquemas'],'readwrite')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.get(key);
        request.onsuccess = (e) => {
            console.log(request)
            form.info.value = request.result.info
            form.version.value = request.result.version
            form.button.dataset.action = "update"
            form.button.textContent = "Actualizar esquema"
        }
    }

    const updateData = (data) => {
        const transaction = db.transaction(['esquemas'],'readwrite')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.put(data);
        request.onsuccess = (e) => {
            form.button.dataset.action = "add"
            form.button.textContent = "Añadir esquema"
            readData()
        }
    }

    const deleteData = (key) => {
        const transaction = db.transaction(['esquemas'],'readwrite')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.delete(key);
        request.onsuccess = (e) => {
            readData()
        }
    }

    const readData = (data) => {
        const transaction = db.transaction(['esquemas'],'readonly')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.openCursor()
        const fragmento = document.createDocumentFragment()

        request.onsuccess = (e) => {
            const cursor = e.target.result
            if(cursor){

                const info = document.createElement("p")
                info.textContent = 'Esquema: '+ cursor.value.info
                fragmento.appendChild(info)
                
                const version = document.createElement("p")
                version.textContent = 'Versión: '+ cursor.value.version
                fragmento.appendChild(version)
                
                const actualizar = document.createElement("button")
                actualizar.dataset.type = "update"
                actualizar.dataset.key = cursor.key
                actualizar.textContent = "Actualizar"
                fragmento.appendChild(actualizar)

                const eliminar = document.createElement("button")
                eliminar.dataset.type = "delete"
                eliminar.textContent = "Eliminar"
                eliminar.dataset.key = cursor.key
                fragmento.appendChild(eliminar)

                cursor.continue()
            }else{
                esquemas.textContent = ""
                esquemas.appendChild(fragmento)
            }
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const data = {
            id: id,
            info: e.target.info.value,
            version: e.target.version.value
        }
        id++
        if(e.target.button.dataset.action == "add"){
            addData(data)
        }else if(e.target.button.dataset.action == "update"){
            updateData(data)
        }
        form.reset()
    })

    esquemas.addEventListener("click", (e) =>{
        if(e.target.dataset.type == "update"){
            getData(e.target.dataset.key)
        }else if(e.target.dataset.type == "delete"){
            deleteData(e.target.dataset.key)
        }

    })

}