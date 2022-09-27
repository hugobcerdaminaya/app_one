export default class apiModule{
    openDB(indexedDB, nameDB, version){
        return indexedDB.open(nameDB, version);
    }

    createObjectStore(db, name, data){
        return db.createObjectStore(name, data)
    }

    SchemaDB(dbname, table){
        // create database
        const db = new Dexie(dbname);
        db.version(1).stores(table)
        db.open();
        return db;
    }
    
    // check textbox validation
    empty(object){
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

    // 1. insert function (on diagram)
    insertValuesDB(dbtable, name, data){
        let flag = this.empty(data);
        if(flag){
            //dbtable.bulkAdd([data]);
            const transaction = dbtable.transaction([name], 'readwrite');
            const objectSore = transaction.objectStore(name);
            const request = objectSore.add(data);
            console.log('dato insertado satisfactoriamente');
        }else{
            console.log('Porfavor ingresa datos');
        }
        return flag;
    }

    // 2. change version schema (on diagram)
    changeVersionSchema(dbtable, data){
        let flag = this.empty(data);
        if(flag){
            dbtable.bulkAdd([data]);
            console.log('dato insertado satisfactoriamente');
        }else{
            console.log('Porfavor ingresa datos');
        }
        return flag;
    }

     // 3 .move between version schemas (on diagram)
     moveBetweenVersion(){
        //acciones a realizar para realizar el movimiento entre esquemas
        return true;
    };
    
    //Sort object
    sortObj(sortboj){
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
    
    //Get data from database
    getSchemas(dbtable, name, fn){
        let index = 0;
        let obj = {};
        //dbtable.count((count)=>{
        const transaction = dbtable.transaction([name], 'readonly');
        const objectStore = transaction.objectStore(name);
        const countRequest = objectStore.count();
        countRequest.onsuccess = () => {    
            if(countRequest){
                console.log(countRequest.result)
                dbtable.each(table=>{
                    obj = this.sortObj(table);
                    fn(obj, index++);
                })
            }else{
                fn(0)
            }
        }
    }
    
    
    //Create dymanic elements
    createElement(tagname, appendTo, fn){
        const element = document.createElement(tagname);
        if(appendTo) appendTo.appendChild(element);
        if(fn) fn(element);
    }
    
    
   
}