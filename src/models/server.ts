import express, { Application } from 'express';
import cors from 'cors';
import { categories, products, subcategories, users, auth } from '../routes';

class Server {
  private app: Application;
  private port: string;
  private endpoints = {
    auth: '/api/auth',
    categories: '/api/categories',
    products: '/api/products',
    subcategories: '/api/subcategories',
    users: '/api/users',
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '8000';

    //middlewares
    this.middlewares();

    //Rutas de la aplicación
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura del body
    this.app.use(express.json());

    //Carpeta pública
    this.app.use(express.static('src/public'));
  }

  routes() {
    this.app.use(this.endpoints.auth, auth);
    this.app.use(this.endpoints.categories, categories);
    this.app.use(this.endpoints.products, products);
    this.app.use(this.endpoints.subcategories, subcategories);
    this.app.use(this.endpoints.users, users);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor en línea en el puerto ${this.port}`);
    });
  }
}

export default Server;
