import express, {type Express, type Request, type Response} from "express"
import cors from "cors"
import { prisma } from "./db"

const app: Express = express();
app.use(cors());                    // Had to add to fix frontend not contacting backend: adds the Access-Control-Allow-Origin header 
app.use(express.json())
const PORT = process.env.PORT || 3000;

async function gatherDevices() {
    try {

        return await prisma.device.findMany()

    } catch (error) {

        console.log(`Error finding devices in DB: ${error}`)
        return null
    }
}

app.get("/api/hello",async (req: Request, res: Response) => {
    //res.json({ message: "message"});w
    const list_of_devices = await gatherDevices();
    res.json({ devices: list_of_devices});
});


app.post("/api/devices:id", async (req: Request, res: Response) => {
    try {
        const { name, status, localIp, action} = req.body
        if (action == "delete") {
            
        } else {
            const device = await prisma.device.create({data: {name: name, status: status, localIp: localIp}})
            res.json({message: "Successfully created device: ", device})
        }
        
    } catch(error) {
        console.log(`Error creating device: ${error}`)
        res.status(500).json({message: "Failed creating entry"})
    }
});

app.delete("/api/")

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});