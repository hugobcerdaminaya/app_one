const SchemaDB = (dbname, table) => {
    // create database
    const db = new Dexie(dbname);
    db.version(1).stores(table)
    db.open();
    return db;
}

// insert function
const bulkcreate = (dbtable, data)=>{
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
const getData = (dbtable, fn)=>{
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

export default SchemaDB;
export{
    bulkcreate,
    getData,
    createElement
}