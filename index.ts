import dotenv from 'dotenv';
import { Server } from './src/models';

dotenv.config();

const server = new Server();

server.listen();
