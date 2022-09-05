const indexedDB = window.indexedDB
if(indexedDB){
    let db
    const request = indexedDB.open('ListasEsquemas', 1)
    request.onsuccess = () =>{
        db = request.result
        console.log('OPEN', db)
    }

    request.onupgradeneeded = () =>{
        db = request.result
        console.log('CREATE', db)
        const objectSore = db.createObjectStore('esquemas',{autoIncrement:true})
    }

    request.onerror = (error) =>{
        console.log('Error'. error)
    }

    const addData = (data) => {
        const transaction = db.transaction(['esquemas'],'readwrite')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.add(data);
    }

    const readData = (data) => {
        const transaction = db.transaction(['esquemas'],'readonly')
        const objectStore = transaction.objectStore('esquemas')
        const request = objectStore.openCursor()
        request.onsuccess = (e) =>{
            const cursor = e.target.result
            if(cursor){
                console.log(cursor.value.information);
                let datos = cursor.value.information;
                let res = document.querySelector('#response');
                res.innerHTML = ''; 
                for(let item of datos){
                    res.innerHTML += `
                        <tr>
                            <td>${item.variable}</td>
                            <td>${item.atributo}</td>
                        </tr>
                    `
                }
                cursor.continue()
            }else{
                console.log('No hay mas datos')
            }
        }
    }

    document.querySelector('#boton_escribir').addEventListener('click', (e) => {
        e.preventDefault()
        const info = [
                            {
                                "variable": "Input",
                                "atributo": "Para captura de un texto simple"
                            },
                            {
                                "variable": "Text area",
                                "atributo": "Para captura de un texto de mayor longitud"
                            },
                            {
                                "variable": "Checkbox",
                                "atributo": "Para selección de una o más opciones disponibles"
                            }
                    ]
        const data = {
            information: info
        }
        addData(data)
    })

    document.querySelector('#boton_leer').addEventListener('click', (e) => {
        e.preventDefault()
        readData()
    })

}