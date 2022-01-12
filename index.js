#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const { exec } = require('child_process');

program
  .option('-c, --controller <type>', 'success make controller')
  .option('-m, --migration <type>', 'success make migration')
  .option('-r, --router <type>', 'success make router')
  .option('-i, --init', 'success make init !')

program.parse(process.argv);

const writeController = () => {
	fs.writeFileSync(`./controllers/${options.controller}.js`, `
const models = require('../models');

const initModel = async (cb) => {
	const model = await models
	const initialized = await model.${options.controller};
	cb(initialized)
}; 

const save = async (body, cb) => await initModel(model=>model.create(body).then(res=>cb(res))); 

const read = async (cb) => await initModel(model=>model.findAll().then(res=>cb(res)))

const edit = async({name, id}, cb) => await initModel(model=>model.update({name}, {where:{id}}).then(res=>cb(res)));

const remove = async ({id}, cb) => await initModel(model=>model.destroy({where:{id}}).then(res=>cb(res))); 

module.exports = {save, read, edit, remove}`);
}
const createController = () =>{
	const dir = './controllers';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {
			recursive: true
		});
		writeController()
	} else {
		writeController()
	}
}

const initSequelize = ()=>{
	exec('npx sequelize-cli init', async (error, data, getter) => {
		if(error){
			console.log("error",error.message);
		}
		if(getter){
			console.log("data",data);
		}
		if(data){
			console.log('berhasil')
		}
	});
}
const makeMigration = (val, cb)=>{
	exec(`npx sequelize-cli migration:generate --name ${options.migration}`, async (error, data, getter) => {
		if(error){
			console.log("error",error.message);
		}
		if(getter){
			console.log("data",data);
		}
		if(data){
			console.log('berhasil')
		}
	});
}

const writeRouter = (val)=>{
	if(val){

		fs.readFile('./router/router.js', "utf8", function read(err, data) {
		    if (err) {
		        throw err;
		    }
		    const content = data
		    const contSplit = content.split(' ').join(' ').split('\r\n').join('\n').split('/n')
		    contSplit.push('\r\n')
		    contSplit.push(`\r\nrouter.get('/${options.router}', (req, res)=> read(${options.router}s) => res.send(${options.router}s))`)
		    contSplit.push(`\r\nrouter.get('/${options.router}:/id', (req, res)=> read(${options.router}) => res.send(${options.router}))`)
		    contSplit.push(`\r\nrouter.post('/${options.router}', (req, res)=> read(${options.router}s) => res.send(${options.router}s))`)
		    contSplit.push(`\r\nrouter.put('/${options.router}/:id', (req, res)=> console.log(req, res))`)
		    contSplit.push(`\r\nrouter.delete('/${options.router}', (req, res)=> console.log(req, res))`)

		    const a = contSplit.join('').split('\n').join('\n')

		    fs.writeFileSync('./router/router.js', a, (res)=>{
		    	console.log(res)
		    });
		});

	} else {
		const contSplit = []
	    contSplit.push('\r\n')
		contSplit.push(`\r\nrouter.get('/${options.router}', (req, res)=> console.log(req, res))`)
	    contSplit.push(`\r\nrouter.get('/${options.router}', (req, res)=> console.log(req, res))`)
	    contSplit.push(`\r\nrouter.get('/${options.router}', (req, res)=> console.log(req, res))`)
	    contSplit.push(`\r\nrouter.get('/${options.router}', (req, res)=> console.log(req, res))`)

	    const a = contSplit.join('').split('\n').join('\n')

	    fs.writeFileSync('./router/router.js', a, (res)=>{
	    	console.log(res)
	    });	
	}
}

const createRouter = ()=>{
	const dir = './router';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {
			recursive: true
		});
		writeRouter(false)
	} else {
		writeRouter(true)
	}
}

const options = program.opts();
if (options.controller) {
	createController();	
}
if (options.init){
	initSequelize()
}

if (options.migration){
	makeMigration()
}

if (options.router){
	createRouter()
}