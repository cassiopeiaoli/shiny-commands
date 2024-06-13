import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());

const commandsDefinitions = {
    "sit": "Sit, Shiny!",
    "send-photo": "Send us a photo, Shiny!",
    "send-nude": "Send us a photo of your nude body, Shiny!",
    "record-voice-message": "Send us your voice, Shiny!",
    "eat": "Time to eat something, Shiny!",
    "sleep": "Time to sleep, Shiny!",
    "nap": "Time for a nappy, Shiny!"
}

const commandsQueue = [];

app.get('/', (_, res) => {
    res.sendFile(
        path.join('views', 'commands.html'),
        { root: '.' }
    );
});

app.get('/notif', (_, res) => {
    res.sendFile(
        path.join('views', 'notif.html'),
        { root: '.' }
    );
});

app.post('/send-command', (req, res) => {
    const command = req.body.command;
    console.log(command);
    if (!Object.keys(commandsDefinitions).includes(command)) {
        res.status(500);
        res.send({ "message": "Invalid command" });
        return
    }
    
    commandsQueue.push(commandsDefinitions[command]);
    res.status(200);
    console.log(commandsQueue);
    res.send({ "message": "Command sent" });
});

app.post('/get-command', (_, res) => {
    const latestCommand = commandsQueue.shift();

    if (latestCommand === undefined) {
        res.send({ "command": undefined });
        return;
    }

    res.send({ "command": latestCommand });
});

app.listen(port, () => {
    console.log('Listening at ' + port);
});