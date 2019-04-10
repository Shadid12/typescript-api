import * as express from 'express';
import Post from './post.interface';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import { fork } from 'child_process';
 
class PostsController {
  public path = '/posts';
  public router = express.Router();
  public app: express.Application;
 
  private posts: Post[] = [
    {
      author: 'Shadid',
      content: 'Dolor sit amet',
      title: 'Lorem Ipsum',
    }
  ];
 
  constructor() {
    this.app = express();
    
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.intializeRoutes();
  }

  private connectToTheDatabase() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
    } = process.env;
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }
 
  public intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.nonBlockingMiddleWare, this.createPost);
  }

  loggerMiddleware = (request: express.Request, response: express.Response, next) => {
    setTimeout(() => {
      console.log(`Running Fake Middleware`);
    }, 3000)
    next();
  }


  blockingMiddleWare = (request: express.Request, response: express.Response, next) => {
    for(let i = 0; i < 100000000; i++) {
      // DO
    }
    console.log(`Done Blocking Task`);
    next();
  }

  // initiating threads
  nonBlockingMiddleWare = (request: express.Request, response: express.Response, next) => {
    // TODO
    const process = fork('./src/posts/send_mail.ts');
    process.send({ 'email': 'address@gmail.com' });
    // listen for messages from forked process
    process.on('message', (message) => {
      console.log(`Number of mails sent ${message.counter}`);
      next();
    });
  }


 
  getAllPosts = (request: express.Request, response: express.Response) => {
    response.send(this.posts);
  }
 
  createPost = (request: express.Request, response: express.Response) => {
    const post =  <Post>{
      author: request.body.author,
      content: request.body.content,
      title: request.body.title,
    };
    this.posts.push(post);
    response.send(post);
  }
}
 
export default PostsController;