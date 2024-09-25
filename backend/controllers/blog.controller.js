export const signup = async (req, res) => {
    try {
        const {username , password , email} = req.body
    } catch (error) {
        return res.status(500).json({
            message: "Error Signing Up"
        })
    }
}

export const login = async (req, res) => {
    try {
        return res.json({
            msg: "update details"
        })
    } catch (error) {

    }
}




export const allBlogs = async (req, res) => {

}
export const getPostById = async (req, res) => {
}

export const newBlog = async (req, res) => {
}
export const updateDetails = async (req, res) => {
    try {
        return res.json({
            msg: "update details"
        })
    } catch (error) {

    }
}
export const deletePost = async (req, res) => {
    try {
        return res.json({
            msg: "update details"
        })
    } catch (error) {

    }
}
