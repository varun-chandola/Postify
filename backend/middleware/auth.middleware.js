import jwt from "jsonwebtoken"
export const authmiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        console.log("token", token)
        if (!token) return res.status(409).json({
            msg: "unauthorized"
        })
        const decoded = jwt.verify(token, process.env.jwt_secret)
        console.log(decoded)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(500).json({
            msg: "error decoding auth token",
            err: error
        })
    }
}
