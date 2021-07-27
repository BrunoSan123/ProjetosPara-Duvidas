const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    const {existOrError,notExistOrError,equalsOrError} = app.api.validator
    const encryptPassword =password=>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password,salt)
    }
    const save = async (req,res)=>{
        const user ={ ...req.body } 
        console.log(user)
        if(req.params.id) user.id=req.params.id
        

        try {
            existOrError(user.name,'Nome Não informado')
            existOrError(user.email,'Email não informado')
            existOrError(user.password,'Senha não informada')
            existOrError(user.confirmPassword,'Confirmação de senha invalida')
            equalsOrError(user.password,user.confirmPassword,'Senhas não conferem')
            

            const userFromDb = await app.db('users')
                .where({email:user.email}).first()

            if(!user.id){
                notExistOrError(userFromDb,'Usuario já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
            
        }

        user.password =encryptPassword(req.body.password)
        delete user.confirmPassword
        if(user.id){
            app.db('users')
                .update(user)
                .where({id:user.id})
                .then(_ => res.status(204).send())
                .catch(err =>res.status(500).send(err))
        }else{
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
                console.log(user)

        }

    }

    const get =(req,res) =>{
        app.db('users')
            .select('id','name','email','admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    return {save,get}
}