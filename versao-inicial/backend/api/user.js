const bcrypt = require('bcrypt-nodejs')
const knex = require('../config/db')



    const {existOrError,notExistOrError,equalsOrError} = require('./utils/validator')
    const encryptPassword =password=>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password,salt)
    }
    const save = async (req,res)=>{
        const user ={...req.body} 
        console.log(user)
        if(req.params.id) user.id=req.params.id
        

        try {
            existOrError(user.name,'Nome Não informado')
            existOrError(user.email,'Email não informado')
            existOrError(user.password,'Senha não informada')
            existOrError(user.confirmPassword,'Confirmação de senha invalida')
            equalsOrError(user.password,user.confirmPassword,'Senhas não conferem')
            

            const userFromDb = await knex('users').where({email:user.email}).first()
                

            if(!user.id){
                notExistOrError(userFromDb,'Usuario já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
            
        }

        user.password =encryptPassword(req.body.password)
        delete user.confirmPassword
        if(user.id){
            knex('users')
                .update(user)
                .where({id:user.id})
                .then(_ => res.status(204).send())
                .catch(err =>res.status(500).send(err))
        }else{
            knex('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
                res.send('Cadastro criado com sucesso')
                console.log(user)

        }

    }

    const get =(req,res) =>{
        knex('users')
            .select('id','name','email','admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }



     const getById =(req,res) =>{
        
        knex('users')
            .select('id','name','email','admin')
            .where({id:req.params.id})
            .first()
            .then(user=> res.json(user))
            .catch(err => res.status(500).send(err))
        
      
    }


    module.exports ={save,get,getById}

  
