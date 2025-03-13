const {createServer} = require("http");
const app = require("./index");
const {initialiseSocket} = require("./socket");

const PORT = process.env.PORT || 8001;
const server = createServer(app);

initialiseSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});