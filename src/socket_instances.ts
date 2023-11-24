import { Server } from "socket.io";

let io: Server | null = null;

function getClientSocket(): Server {
  if (!io) {
    io = new Server(8001, {
      cors: {
        origin: "*",
      },
    });
  }
  return io;
}

export { getClientSocket };

// // setting up socket io
// const io = new Server(8001, {
//   cors: {
//     origin: "*",
//   },
// });
