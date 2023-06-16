const express = require('express');
const bodyParser = require('body-parser');
const programer = require('./database/tables/programer');
const { Association } = require('sequelize');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.get('/syncDatabase', async(req,res)=>{
    const database = require('./database/db');

    try{
        await database.sync();

        res.send('Database sucessfully sync');
    }catch(error){
        res.send(error);
    }
});

app.post('/createProgramer' , async(req,res) =>{
    try{
        const params = req.body;

        const properties = ['name' ,'javascript','java','python'];

        validatePropreties(properties,params,'every');

        const newProgamer = await programer.create({
            name:params.name,
            javascript:params.javascript,
            java:params.java,
            python:params.python
        })

        res.send(newProgamer);

    }catch(error){
        res.send(error);
    }
});


app.get('/retrieveProgramer' , async(req,res) =>{
    try{
        const params = req.body;
        
        if('id' in params){
            const record = await programer.findByPk(params.id);

            if(record){
                res.send(record);
            } else {
                res.send('No programer found using recieved ID');
            }
            return;
        }

        const records = await programer.findAll();

        res.send(records);

    }catch (error){
        res.send(error);
    }
});

app.put('/updateProgramer' , async(req,res)=>{
    try{
        const params = req.body;

        const record = await validateID(params);

        const properties = ['name' ,'python','java','javascript'];

        validatePropreties(properties,params,'some');

        record.name = params.name || record.name;
        record.python = params.python || record.python;
        record.java = params.java || record.java;
        record.javascript = params.javascript || record.javascript;

        await record.save();

        res.send(`${record.id} ${record.name} - update sucessfully`);

    }catch (error){
        res.send(error);
    }
});

app.delete('/deleteProgramer' , async(req,res)=>{
    try{
    const params = req.body;

    const record = await validateID(params);

    await record.destroy();

    res.send(`${record.id} ${record.name} - Delete sucessfully`);

    } catch (error){
        res.send(error);
    }

});


const validateID = async (params) =>{
    try{
    if(!'id' in params){
        throw "Missing 'id' in request body";
    }
    const record = await programer.findByPk(params.id);

    if(!record){
        throw 'Programer ID not found';
    }
    return record;
    } catch (error){
        throw error;
    }
}

const validatePropreties = async (properties,params,fn) =>{
    const check = properties[fn]((property) =>{
        return property in params;
    });

    if(!check){
        const propStr = properties.join(',');
        res.send(`Request body doesn't have any of the following properties ${propStr}`);
        return;
    }
}










app.listen(port, ()=>{
    console.log(`Now Listen ${port}`);
});