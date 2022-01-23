import 'dotenv/config';
import express , {Request, Response, NextFunction} from 'express';
import http from 'http';
import cors from 'cors';

import { Server } from 'socket.io';

import { router } from './routes';

const app = express();

app.use((req: Request,res: Response,next: NextFunction) => {
  //Qual site a permissão para realizar a conexão abaixo
  res.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
})

// app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["*"],    
  }
});

io.on("connection",  socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
})

app.use(express.json());

app.use(router);

app.get('/github', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get('/signin/callback', (req, res ) => {
  const { code } = req.query;

  return res.json(code);
})

export { server, io } ;