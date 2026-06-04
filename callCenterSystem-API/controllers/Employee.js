const {employees,Calls} = require('../models')
const{Op}=require('sequelize')

const createEmployee=async(req,res)=>
{

    try
    {

        const{name,is_available,rank}=req.body

        if(!name||typeof name!=='string'||name.trim()==='')
        {

            return res.status(400).json({message:'El nombre es requerido'})

        }

        //el nombre no puede repetirse
        const existingEmployee=await employees.findOne({where:{name}})

        if(existingEmployee)
        {

            return res.status(409).json({message:'El nombre del empleado ya existe'})

        }

        if(typeof is_available!=='boolean')
        {

            return res.status(400).json({message:'is_available debe ser un true o false'})

        }

        if(typeof rank!=='number'||rank<1)
        {

            return res.status(400).json({message:'rank debe ser numerico'})

        }

        const employ=await employees.create({

            name,
            is_available,
            rank,

        })

        res.status(201).json({message:"Empleado registrado correctamente",employ})


    }catch(error){

        res.status(500).json({message:error.message})

    }

}


const desactivarEmployee=async(req,res)=>
{

    try
    {

        const{id}=req.params
        const employee=await employees.findByPk(id)

        if(!employee)
        {

            return res.status(404).json({message:"Empleado no encontrado"})

        }

        //no se puede desactivar un empleado con una llamada activa
        const activeCall=await Calls.findOne({where:{employeeId:id,finished_at:{[Op.is]:null}}})
        if(activeCall)
        {

            return res.status(409).json({message:"No se puede desactivar un empleado con una llamada activa"})

        }

        if(!employee.is_available)
        {

            return res.status(409).json({message:"El empleado ya esta desactivado"})

        }

        await employee.update({is_available:false})

        res.json({message:"Empleado desactivado correctamente"})


    }catch(error){

        res.status(500).json({message:error.message})

    }   

}

const activarEmpleado=async(req,res)=>
{

    
    try
    {

        const{id}=req.params
        const employee=await employees.findByPk(id)

        if(!employee)
        {

            return res.status(404).json({message:"Empleado no encontrado"})

        }

        if(employee.is_available)
        {

            return res.status(409).json({message:"El empleado ya esta activado"})

        }

        await employee.update({is_available:true})

        res.json({message:"Empleado activado correctamente"})


    }catch(error){

        res.status(500).json({message:error.message})

    }   

}

const getEmployee=async(req,res)=>
{

    try
    {

        const limit=parseInt(req.query.limit)||5
        const offset=parseInt(req.query.offset)||0

        if(limit<1)
        {

            return res.status(400).json({message: "limit debe ser mayor a 0"});

        }

        if(offset<0){

            return res.status(400).json({message: "offset no puede ser negativo"});

        }

       const employee=await employees.findAndCountAll({limit,offset})

        res.json({total:employee.count,employee:employee.rows})

    }catch(error){

        res.status(500).json({message:error.message})

    }

}

const getEmployeeById=async(req,res)=>
{

    try
    {

        const {id}=req.params
        const employee=await employees.findByPk(id)

        if(!employee)
        {

            return res.status(404).json({message:"Empleado no encontrado"})

        }

        res.json(employee)

    }catch(error){

        res.status(500).json({message:error.message})

    }

}

module.exports={createEmployee,desactivarEmployee,activarEmpleado,getEmployee,getEmployeeById}
