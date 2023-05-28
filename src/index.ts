import express, { Request, Response } from "express";
import cors from "cors";
import { postRoute} from "./router/userRoute";
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(cors());

app.use(express.json());

app.listen(Number(process.env.PORT) || 3003,()=>{console.log(`Servidor rodando na porta ${3003}`);

})
app.use('/posts', postRoute)