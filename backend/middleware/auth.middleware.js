import jwt from "jsonwebtoken"
export const authmiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        console.log(token)
        if (!token) return res.status(409).json({
            msg: "unauthorized . login first"
        })

        const decoded = jwt.verify(token, process.env.jwt_secret)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(500).json({
            msg: "error decoding auth token",
            err: error
        })
    }
}