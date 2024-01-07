const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});

const host='127.0.0.1';


server.on("connection", (socket) => {
  console.log("new connection");
  let filehandle, filestream;

  socket.on("data", async (data) => {
    if (!filehandle) {
      socket.pause(); //pause receiving data from client for opening file

      const indexOfDivider = data.indexOf("------");
      const filename = data.subarray(10, indexOfDivider).toString("utf-8");

      filehandle = await fs.open(`storage/${filename}`, "w");
      filestream = filehandle.createWriteStream();
      //writing to the destination file
      filestream.write(data.subarray(indexOfDivider + 6));
      socket.resume(); //resume receiving data from client
      filestream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!filestream.write(data)) {
        //internal buffer full
        socket.pause();
      }
    }
  });

  //end event fires when client.js ends the socket
  socket.on("end", () => {
    filehandle.close();
    console.log("connectin ended");
    filehandle = undefined;
    filestream = undefined;
  });
});


server.listen(3000, host, () => {
  console.log("server running at:", server.address());
});
// server.listen(3000, "::1", () => {//ip6 address
//   console.log("server running at:", server.address());
// });
