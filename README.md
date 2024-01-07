
# TCP-Based-File-Uploading-Server

This project provides a simple file uploading server utilizing Node.js's TCP module for communication.


## Run Locally

You can only use terminal for running server and client.

To start the server:
```bash
node server.js
```

To start the client and upload the file, use the following command
and make sure you inlclude the correct filepath of the file.
```bash
node client.js filepath
```


## Features
You can use your router's ip address to upload a file from different device if connected to the same router. 

For that ,change the host in server.js and client.js to your 
router's ip address.