import { Server } from "socket.io";
const PORT = 8001;

let io: Server | null = null;

function getClientSocket(): Server {
  if (!io) {
    io = new Server(PORT, {
      cors: {
        origin: "*",
      },
    });
  }
  return io;
}

export { getClientSocket };
