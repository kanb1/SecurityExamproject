import prisma from "../db"
import {createJWT, hashPassword} from "../modules/auth"


export const createNewUser = async (req: request, res: response) => {
    const user = await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: await hashPassword(req.body.password)

        }
    })
    const token = createJWT(user)
    res.json({token: token})
}