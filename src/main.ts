import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { IoAdapter } from "@nestjs/platform-socket.io";
import cookieParser from "cookie-parser";

class MyIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    options = {
      ...options,
      cors: {
        origin: "http://localhost:3001", // replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    };
    return super.createIOServer(port, options);
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useWebSocketAdapter(new MyIoAdapter(app));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
