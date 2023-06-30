import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { IoAdapter } from "@nestjs/platform-socket.io";
import cookieParser from "cookie-parser";
import { urlencoded, json } from "body-parser";
import { ErrorInterceptor } from "./ErrorInterceptor";

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
  app.useGlobalFilters(new ErrorInterceptor());
  app.use(cookieParser());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: true }));
  app.useWebSocketAdapter(new MyIoAdapter(app));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
