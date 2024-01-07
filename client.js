const net = require("net");
const path = require("path");
const fs = require("fs/promises");

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const host='127.0.0.1';
const socket = net.createConnection(
  { host: host, port: 3000 },
  async () => {
    try {
      // console.log(process.argv); // we run clinet as (node client.js) gives the location of node and client  from C:\\.....
      const filepath = process.argv[2]; //node server.js filepath
      const filename = path.basename(filepath); //returns the file at last. eg, c/user/acer/file.txt gives file.txt
      const filehandle = await fs.open(filepath, "r");
      const filestream = filehandle.createReadStream();
      const fileSize = (await filehandle.stat()).size;

      let uploadedPercent = 0;
      let bytesUploaded = 0;

      socket.write(`fileName: ${filename}------`);
      //reading from source     file

      console.log();

      filestream.on("data", async (data) => {
        if (!socket.write(data)) {
          filestream.pause();
          //if buffer full ,pause
        }
        bytesUploaded += data.length;
        let newpercent = Math.floor((bytesUploaded / fileSize) * 100);

        if (newpercent !== uploadedPercent) {
          uploadedPercent = newpercent;
          await moveCursor(0, -1);
          await clearLine(0);
          console.log(`Uploading ... ${uploadedPercent}%`);
        }
      });

      socket.on("drain", () => {
        filestream.resume();
      });

      filestream.on("end", () => {
        console.log("file uploaded successfully");
        socket.end();
      });
    } catch (error) {
      return console.log("Error");
    }
  }
);
