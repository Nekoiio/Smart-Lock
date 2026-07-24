import express, {type Express, type Request, type Response} from "express"
import cors from "cors"

const app: Express = express();
app.use(cors());                    // Had to add to fix frontend not contacting backend: adds the Access-Control-Allow-Origin header 
const PORT = process.env.PORT || 3000;

app.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "message"});
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});