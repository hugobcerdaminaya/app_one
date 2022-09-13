const indexedDB = window.indexedDB
const form = document.getElementById("form")
const esquemas = document.getElementById("esquemas")

//Example use dexie.js  
const db = new Dexie("FriendDatabase");
db.version(1).stores({
  friends: `
    id,
    name,
    age`,
});

// Now add some values.
db.friends.bulkPut([
    { id: 1, name: "Josephine", age: 21 },
    { id: 2, name: "Per", age: 75 },
    { id: 3, name: "Simon", age: 5 },
    { id: 4, name: "Sara", age: 50, notIndexedProperty: 'foo' }
  ]).then(() => {

    return db.friends.where("age").between(0, 25).toArray();

  }).then(friends => {

    console.log("Found young friends: " +
      friends.map(friend => friend.name));

    return db.friends
      .orderBy("age")
      .reverse()
      .toArray();

  }).then(friends => {

    console.log("Friends in reverse age order: " +
      friends.map(friend => `${friend.name} ${friend.age}`));

    return db.friends.where('name').startsWith("S").keys();

  }).then(friendNames => {

    console.log("Friends on 'S': " + friendNames);

  }).catch(err => {

    console.log("Ouch... " + err);

  });

//Example use dexie.js  


if(indexedDB && form){
    let db
    const request = indexedDB.open('ListasEsquemas', 1)
    request.onsuccess = () =>{
        db = request.result
        console.log('OPEN', db)
        readData()
    }

    request.onupgradeneeded = () =>{
        db = request.result
        console.log('CREATE', db)
        const objectSore = db.createObjectStore('esquemas',{keyPath:"esquemaTitulo"})
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
        const transaction = db.transaction(['esquemas'],'readwrite')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.get(key);
        request.onsuccess = (e) => {
            form.titulo.value = request.result.esquemaTitulo
            form.prioridad.value = request.result.esquemaPrioridad
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

                const esquemaTitulo = document.createElement("p")
                esquemaTitulo.textContent = cursor.value.esquemaTitulo
                fragmento.appendChild(esquemaTitulo)
                
                const esquemaPrioridad = document.createElement("p")
                esquemaPrioridad.textContent = cursor.value.esquemaPrioridad
                fragmento.appendChild(esquemaPrioridad)
                
                const esquemaActualizar = document.createElement("button")
                esquemaActualizar.dataset.type = "update"
                esquemaActualizar.dataset.key = cursor.key
                esquemaActualizar.textContent = "Actualizar"
                fragmento.appendChild(esquemaActualizar)

                const esquemaEliminar = document.createElement("button")
                esquemaEliminar.dataset.type = "delete"
                esquemaEliminar.textContent = "Eliminar"
                esquemaEliminar.dataset.key = cursor.key
                fragmento.appendChild(esquemaEliminar)

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
            esquemaTitulo: e.target.titulo.value,
            esquemaPrioridad: e.target.prioridad.value
        }
        
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