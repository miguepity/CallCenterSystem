const employees = require('../models')
const{employee}=require('../models/employees')

const createEmployee=async(req,res)=>
{

    try
    {

        const{name,is_available,rank}=req.body

        if(!name.trim()==='')
        {

            return res.status(400).json({message:'El nombre es requerido'})

        }
        const employ=await employees['employees'].create({
            name:name,
            is_available:is_available,
            rank:rank

        })

        res.status(201).json({message:"Empleado registrado correctamente"})


    }catch(error){

        res.status(500).json({message:error.message})

    }

}


// const desactivarEmployee=async(req,res)=>
// {

//     try
//     {

//         const{id}=req.params
//         const employee=await employees.findByPk(id)

//         if(!employee)
//         {

//             return res.status(404).json({message:"Empleado no encontrado"})

//         }

//         if(!employee.is_available)
//         {

//             return res.status(404).json({message:"El empleado no esta disponible"})

//         }

//         await employee.update({is_available:false})

//         res.json({message:"Empleado no disponible"})


//     }catch(error){

//         res.status(500).json({message:error.message})

//     }   

// }

// const activarEmpleado=async(req,res)=>
// {

    
//     try
//     {

//         const{id}=req.params
//         const employee=await employees.findByPk(id)

//         if(!employee)
//         {

//             return res.status(404).json({message:"Empleado no encontrado"})

//         }

//         if(!employee.is_available)
//         {

//             return res.status(404).json({message:"El empleado ya esta disponible"})

//         }

//         await employee.update({is_available:false})

//         res.json({message:"Empleado disponible!"})


//     }catch(error){

//         res.status(500).json({message:error.message})

//     }   

// }

// const getEmployee=async(req,res)=>
// {

//     try
//     {

//         const limit=parseInt(req.query.limit)||5
//         const offset=parseInt(req.query.offset)||0

//         const employe=await employees.findAndCountAll({limit,offset})

//         res.json({total:employe.count,employe:employe.rows})

//     }catch(error){

//         res.status(500).json({message:error.message})

//     }

// }


module.exports={createEmployee}