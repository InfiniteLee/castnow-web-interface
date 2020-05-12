import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    url: localStorage.getItem("url") || "",
    lastUsedDevice: localStorage.getItem("lastUsedDevice") || "",
    devices: [],
    deviceInfo:{}
  }

  componentDidMount() {
    fetch('/devices')
      .then(res => res.json())
      .then(devices => { 
        this.setState({ devices });
        const deviceInfo = {};
        devices.forEach(device => {
          deviceInfo[device.name] = device;
        });
        this.setState({ deviceInfo });    
      });
  }

  handleUrlChange = (event) => {
    const url = event.target.value;
    localStorage.setItem("url", url);
    this.setState({ url });
  }

  handleDeviceChange = (event) => {
    const lastUsedDevice = event.target.value;
    localStorage.setItem("lastUsedDevice", lastUsedDevice);
    this.setState({ lastUsedDevice });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const url = event.target[0].value;
    const device = this.state.deviceInfo[event.target[1].value];
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid: device.uuid,
        address: device.address,
        port: device.port,
        url: url
      })
    };

    fetch('/cast/play', requestOptions)
      .then(res => res.json())
      .then(data => console.log(data));
  }

  handleCommand = (command, event) => {
    event.preventDefault();

    const device = this.state.deviceInfo[this.state.lastUsedDevice];

    if (!device) return;
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid: device.uuid,
        address: device.address,
        port: device.port,
        command: command
      })
    };

    fetch('/cast/command', requestOptions)
      .then(res => res.json())
      .then(data => console.log(data));
  }
  
  
  render() {
    return (
      <div className="App">
        <h1>URL Cast</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Cast url:
            <br></br>
            <input
            name="url"
            type="text"
            value={this.state.url}
            onChange={this.handleUrlChange} />
          </label>
          <br></br>
          <label>
            Select a cast target:
            <br></br>
          <select value={this.state.lastUsedDevice} onChange={this.handleDeviceChange}>
            {this.state.devices.map(device => 
              <option key={device.name} value={device.name}>{device.name}</option>
            )} 
            </select>
          </label>
          <br></br>
          <input type="submit" value="Cast" />
        </form>

        <button onClick={this.handleCommand.bind(this, "stop")}>
        Stop Casting
        </button>
        <br></br>
        <button onClick={this.handleCommand.bind(this, "volup")}>
        Increase Volume
        </button>
        <button onClick={this.handleCommand.bind(this, "voldown")}>
        Decrease Volume
        </button>
      </div>
    );
  }
}

export default App;