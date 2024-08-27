const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const doctorDetails = require('fs');
const pseDetails = require('fs');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const rooms = ['R1', 'R2', 'R3', 'R4'];

const mailService = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xlrppt@gmail.com',
        pass: 'oejifjnzeqnqgycf'
    }
});

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));

app.use(express.static(path.join(__dirname, 'web')));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = 2024;
const doctorList = {};

// API for node mcu sen data
app.get('/senddata', (req, res) => {
    let details = {
        roomId: req.query.roomId,
        hurtRate: req.query.hurtRate,
        oxLvl: req.query.oxlvl
    };

    if (details.oxLvl < 90 || details.hurtRate < 60) {
        doctorDetails.readFile('pse.txt', 'utf8', (err, data) => {
            let mailNeedToSend = JSON.parse(data).find((eachPse) => eachPse.room == details.roomId);
            if (mailNeedToSend) {
                if (doctorList[mailNeedToSend['doctor']] == undefined || (new Date(doctorList[mailNeedToSend['doctor']] + 1 * 60 * 1000).getTime()) < new Date().getTime()) {
                    doctorList[mailNeedToSend['doctor']] = new Date().getTime();
                    mailService.sendMail({
                        from: '"Hey Doctor" <xlrppt@gmail.com>',
                        to: mailNeedToSend['doctor'],
                        subject: 'Patient is in danger',
                        text: `Hey doctor the ${details.roomId} is in denger.`
                    }, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                    });
                }
            }
        });
    }

    io.emit("receive", details);
    res.send('Done').status(200);
});

// Api for admin login
app.post('/loginadmin', (req, res) => {
    let loginId = req.body.loginId;
    let password = req.body.password;

    if (loginId == 'admin' && password == 'admin@123') {
        res.send('1');
    } else {
        res.send('0');
    }
});

// API for create doctor
app.post('/add_doctor', (req, res) => {
    let details = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    };

    doctorDetails.readFile('doctor.txt', 'utf8', (err, data) => {
        let d = JSON.parse(data);
        d.push(details);

        doctorDetails.writeFile('doctor.txt', JSON.stringify(d), (err) => { });
        res.send('Done');
    });
});

// API for create present
app.post('/add_pes', (req, res) => {
    let details = {
        mobile: req.body.mobile,
        name: req.body.name,
        doctor: req.body.doctor,
        room: req.body.room
    };

    doctorDetails.readFile('pse.txt', 'utf8', (err, data) => {
        let d = JSON.parse(data);
        d.push(details);

        doctorDetails.writeFile('pse.txt', JSON.stringify(d), (err) => { });
        res.send('Done');
    });
});

// API for get dashboard
app.get('/dashboardApi', (req, res) => {
    let sendResponce = {};

    sendResponce['room'] = rooms;

    doctorDetails.readFile('doctor.txt', 'utf8', (err, data) => {
        sendResponce['doctors'] = JSON.parse(data);
        pseDetails.readFile('pse.txt', 'utf8', (err, data1) => {
            sendResponce['pse'] = JSON.parse(data1);

            res.send(sendResponce);
        });
    });
});

// API for doctor login
app.post('/logindoctor', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    doctorDetails.readFile('doctor.txt', 'utf8', (err, data) => {
        let d = JSON.parse(data);
        if (d.find((eachData) => eachData.email == email && eachData.password == password)) {
            res.send('1');
        } else {
            res.send('0');
        }
    });
});

// API for get list of each doctor assigned rooms
app.get('/get_room', (req, res) => {
    let selectedDoctor = req.query.doctor;
    let listOfRooms = [];

    pseDetails.readFile('pse.txt', 'utf8', (err, data) => {
        let d = JSON.parse(data);

        for (let index = 0; index < d.length; index++) {
            if (d[index]['doctor'] == selectedDoctor) {
                listOfRooms.push(d[index]['room']);
            }
        }

        res.send(listOfRooms);
    });
});

// API for check mobile number is exist
app.get('/checkmobile', (req, res) => {
    let mobile = req.query.mobile;

    pseDetails.readFile('pse.txt', 'utf8', (err, data) => {
        let d = JSON.parse(data);
        let findRecord = d.find((eachData) => eachData.mobile == mobile);
        if (findRecord) {
            res.send(findRecord['room']);
        } else {
            res.send('0');
        }
    });
});

// API for get all rooms
app.get('/getrooms', (req, res) => {
    res.send(rooms);
});

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.id);
    });
});

// UI rendering
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

server.listen(port, () => {
    console.log('Server listening on port ' + port);
});