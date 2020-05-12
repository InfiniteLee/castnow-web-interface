const router = require('express').Router();
const cp = require('child_process');
const PythonShell = require('python-shell').PythonShell;

router.post('/play', function (req, res, next) {
    const uuid = req.body.uuid;
    const address = req.body.address;
    const port = req.body.port;
    const url = req.body.url;

    const options = {
        mode: "text",
        pythonPath: 'python3',
        args: ["--uuid", uuid, "--addr", address, "--port", port, "--url", url]
    };

    PythonShell.run("pychromecast_helper.py", options, function (err, response) {
        if (err) res.json(err);
        res.json(response);

    });
})

router.post('/command', function (req, res, next) {
    const uuid = req.body.uuid;
    const address = req.body.address;
    const port = req.body.port;
    const command = req.body.command;

    const options = {
        mode: "text",
        pythonPath: 'python3',
        args: ["--uuid", uuid, "--addr", address, "--port", port, `--${command}`]
    };

    PythonShell.run("pychromecast_helper.py", options, function (err, response) {
        if (err) res.json(err);
        res.json(response);

    });
})

module.exports = router
