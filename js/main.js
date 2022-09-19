
import SchemaDB, {
    bulkcreate, 
    getData, 
    createElement
} from "./Module.js";

let db = SchemaDB("SchemaDB",
    {schemas: `++id, title, content, version`});


//inputs
const schemaid = document.getElementById("schemaid");
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
    let flag = bulkcreate(db.schemas, {
        title: title.value, 
        content: content.value, 
        version: version.value
    });
    title.value = content.value = "";
    version.value = "1";
    getData(db.schemas, (data)=>{
        schemaid.value = data.id + 1 || 1;
    });
    table();
    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag,insertmsg);
}


//create event on btn read button
btnread.onclick = table;

//update event on btn update button
btnupdate.onclick = () =>{
    let flag = bulkcreate(db.schemas, {
        title: title.value, 
        content: content.value, 
        version: version.value
    });
    getData(db.schemas, (data)=>{
        schemaid.value = data.id + 1 || 1;
    });
    table();
    let updatemsg = document.querySelector(".updatemsg");
    getMsg(flag, updatemsg);
    title.value = content.value = "";
    version.value = "1";
    /*const id = parseInt(schemaid.value || 0);
    if(id){
        db.schemas.update(id, {
            title:title.value,
            content:content.value,
            version:version.value
        }).then((updated)=>{
            let get = updated ? true : false;
            let updatemsg = document.querySelector(".updatemsg");
            getMsg(get, updatemsg);
            table();
            title.value = content.value = version.value = "";
        });
    }*/
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

    getData(db.schemas, (data)=>{
        if(data){
            createElement("tr",tbody, tr=>{
                for (const value in data){
                    createElement("td", tr, td=>{
                        td.textContent = data[value];
                    });
                }
                createElement("td",tr, td =>{
                    createElement("i", td, i=>{
                        i.className += "fas fa-edit btnedit";
                        i.setAttribute(`data-id`, data.id);
                        i.onclick = editbtn;
                    });
                    
                })
                createElement("td",tr, td =>{
                    createElement("i", td, i=>{
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute(`data-id`, data.id);
                        i.onclick = deletebtn;
                    });
                    
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
        schemaid.value = data.id + 1; //data.id || 0;
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
}

function textID(textboxid){
    getData(db.schemas, data=>{
        textboxid.value = data.id + 1 || 1;
    });
}












