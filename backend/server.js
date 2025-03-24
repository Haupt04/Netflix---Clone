import express from "express";
import cookieParser from "cookie-parser";

import movieRoutes from "./routes/movie.route.js"
import authRoutes from "./routes/auth.route.js"
import tvShowRoutes from "./routes/tvShow.route.js"
import { protectRoute } from "./middleware/protectRoute.middleware.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import searchRoutes from "./routes/search.route.js"
import path from "path"




const app = express();
const PORT = ENV_VARS.PORT
const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser()) // allows you to access cookie

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/movie",protectRoute, movieRoutes)
app.use("/api/v1/tv",protectRoute, tvShowRoutes)
app.use("/api/v1/search",protectRoute, searchRoutes)

// Convert React to static assets
if (ENV_VARS.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}



app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
    connectDB()
})
