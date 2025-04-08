
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()



//middleware
app.use(express.json({limit:"16kb"}))
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next();
})


export {app} 