//Api frontend
//routes


//urldomain/api/esquema/{data} --- store
//urldomain/api/esquema/{id} --- get

const SchemaDB = (dbname, table) => {
    // create database
    const db = new Dexie(dbname);
    db.version(1).stores(table)
    db.open();
    return db;
}

// insert function
const insertValuesDB = (dbtable, data)=>{
    let flag = empty(data);
    if(flag){
        dbtable.bulkAdd([data]);
        console.log('dato insertado satisfactoriamente');
    }else{
        console.log('Porfavor ingresa datos');
    }
    return flag;
}

// check textbox validation
const empty = object => {
    let flag = false;
    for(const value in object){
        if(object[value] != "" && object.hasOwnProperty(value)){
            flag = true;
        }else{
            flag = false;
        }
    }
    return flag;
}

//Get data from database
const getSchemas = (dbtable, fn)=>{
    let index = 0;
    let obj = {};
    dbtable.count((count)=>{
        if(count){
            dbtable.each(table=>{
                obj = sortObj(table);
                fn(obj, index++);
            })
        }else{
            fn(0);
        }
    })
}

//Sort object
const sortObj = sortboj => {
    let obj = {};
    obj = {
        id:sortboj.id,
        schemanumber:sortboj.schemanumber,
        title:sortboj.title,
        content:sortboj.content,
        version:sortboj.version
    }
    return obj;
}

//Create dymanic elements
const createElement = (tagname, appendTo, fn) =>{
    const element = document.createElement(tagname);
    if(appendTo) appendTo.appendChild(element);
    if(fn) fn(element);
}


//Validate last version 
function validateLastVersion(dbtable, value) {
    let x = dbtable.where('schemanumber').equals(value);
    let y = x.count().then (function(c){return c});
    return y;
};


//move between version schemas
const moveBetweenVersion = () => {
    //acciones a realizar para realizar el movimiento entre esquemas
    return true;
};


export default SchemaDB;
export{
    insertValuesDB,
    getSchemas,
    createElement,
    validateLastVersion,
    moveBetweenVersion
}