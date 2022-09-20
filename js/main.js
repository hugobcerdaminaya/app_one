
import SchemaDB, {
    insertValuesDB, 
    getSchemas, 
    createElement,
    moveBetweenVersion
} from "./Module.js";

let db = SchemaDB("SchemaDB",
    {schemas: `++id, title, content, version, schemanumber`});


//inputs
const schemaid = document.getElementById("schemaid");
const schemanumber = document.getElementById("schemanumber");
const title = document.getElementById("title");
const content = document.getElementById("content");
const version = document.getElementById("version");

//buttons
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

//notfound
const notfound = document.getElementById("notfound");

//insert value using create button
btncreate.onclick = (event) =>{
    let flag = insertValuesDB(db.schemas, {
        schemanumber: schemanumber.value,
        title: title.value, 
        content: content.value, 
        version: version.value
    });
    title.value = content.value = "";
    version.value = "1";
    getSchemas(db.schemas, (data)=>{
        schemaid.value = data.id + 1 || 1;
        schemanumber.value = data.id + 1 || 1;
    });
    table();
    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag,insertmsg);
}


//create event on btn read button
btnread.onclick = table;

//update event on btn update button
btnupdate.onclick = () =>{
    let flag = insertValuesDB(db.schemas, {
        schemanumber: schemanumber.value, 
        title: title.value, 
        content: content.value, 
        version: version.value
    });
    getSchemas(db.schemas, (data)=>{
        schemaid.value = data.id + 1 || 1;
        schemanumber.value = data.schemanumber || 1;
    });
    table();
    let updatemsg = document.querySelector(".updatemsg");
    getMsg(flag, updatemsg);
    title.value = content.value = "";
    version.value = "1";
};

//delete records
btndelete.onclick = () =>{
    db.delete();
    db = SchemaDB("SchemaDB",
        {schemas: `++id, title, content, version`
    });
    db.open();
    table();

    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
    textID(schemaid);
}

function table(){
    const tbody = document.getElementById("tbody")

    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild);
    }

    getSchemas(db.schemas, (data)=>{
        if(data){
            createElement("tr",tbody, tr=>{
                for (const value in data){
                    createElement("td", tr, td=>{
                        td.textContent = data[value];
                    });
                }

               //if index == total versiones
                    createElement("td",tr, td =>{
                       db.schemas.where('schemanumber').equals(data.schemanumber).count()
                                 .then(function(response){
                            if (response == parseInt(data.version)){
                                createElement("i", td, i=>{
                                    i.className += "fas fa-edit btnedit";
                                    i.setAttribute(`data-id`, data.id);
                                    i.onclick = editbtn;
                                });
                            }
                        })
                    })
                    createElement("td",tr, td =>{
                       db.schemas.where('schemanumber').equals(data.schemanumber).count()
                                 .then(function(response){
                        if(response == parseInt(data.version)){
                                createElement("i", td, i=>{
                                    i.className += "fas fa-trash-alt btndelete";
                                    i.setAttribute(`data-id`, data.id);
                                    i.onclick = deletebtn;
                                });
                            }
                       })
                    })
            
            });
        }else{
            notfound.textContent = "No se han encontrado registros en la base de datos";
        }
    }); 
}

function editbtn(event){
    let id = parseInt(event.target.dataset.id);
    db.schemas.get(id,data=>{
        schemaid.value = data.id + 1;
        schemanumber.value = data.schemanumber;
        title.value = data.title || "";
        content.value = data.content || "";
        version.value = parseInt(data.version) + 1 || "";
    })
}

function deletebtn(event){
    let id = parseInt(event.target.dataset.id);
    db.schemas.delete(id);
    table();
}

function getMsg(flag,element){
    if(flag){
        element.className += "movedown";
        setTimeout(()=>{
            element.classList.forEach(className =>{
                className == "movedown" ? undefined : element.classList.remove("movedown")
            });
        }, 4000)
    }
}

//window onload event
window.onload = () =>{
    table();
    textID(schemaid);
    textSchemaNumber(schemanumber);
}

function textID(textboxid){
    getSchemas(db.schemas, data=>{
        textboxid.value = data.id + 1 || 1;
    });
}

function textSchemaNumber(textboxschemanumber){
    getSchemas(db.schemas, data=>{
        textboxschemanumber.value = parseInt(data.schemanumber) + 1 || 1;
    });
}












