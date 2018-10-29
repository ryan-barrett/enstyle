const constraints = {
  video: true
};

let cameraToUse;
let currentDevice = {
  deviceId: ""
};

const video = document.querySelector("video");

navigator.mediaDevices
  .enumerateDevices()
  .then(gotDevices)
  .then(getStream);

function gotDevices(deviceInfos) {
  console.log(deviceInfos);
  let cameras = [];
  deviceInfos.forEach(device => {
    if (device.kind === "videoinput") {
      cameras.push(device);
    }
  });
  if (cameras.length > 1) {
    currentDevice = cameras[1].deviceId;
    getStream();
  } else {
    currentDevice = cameras[0].deviceId;
    getStream();
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  const otherConstraints = {
    video: {
      deviceId: { exact: currentDevice }
    }
  };

  navigator.mediaDevices
    .getUserMedia(otherConstraints)
    .then(gotStream)
    .catch(handleError);
}

const captureVideoButton = document.querySelector("#screenshot.capture-button");
const screenshotButton = document.querySelector("#screenshot-button");
// const img = document.querySelector("#screenshot-target");

const canvas = document.createElement("canvas");

function handleSuccess(stream) {
  screenshotButton.disabled = false;
  video.srcObject = stream;
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  video.srcObject = stream;
}

function handleError(error) {
  console.log("Error: ", error);
}

screenshotButton.onclick = video.onclick = function() {
  //clear any previous screenshots
  const screenshotContainer = document.querySelector("#screenshot-container");
  if (screenshotContainer.firstChild !== null) {
    screenshotContainer.firstChild.remove();
  }

  // Other browsers will fall back to image/png
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  //create and customize new img element
  const newImg = document.createElement("img");
  newImg.classList.add("main-content", "main-button");
  screenshotContainer.appendChild(newImg);

  newImg.src = canvas.toDataURL("image/webp");
  const test = "hello";
  fetch("http://localhost:3000/searchForProduct", {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ payload: newImg.src })
  })
    .then(response => {
      console.log('test')
      return response.json();
    })
    .catch(err => {
      console.log(err)  
    })
};
