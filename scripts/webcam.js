

document.addEventListener("DOMContentLoaded", function(event) { 
    const video = document.getElementById('camera-feed');
    const buttonStart = document.getElementById('camera-start');
    const buttonStop = document.getElementById('camera-stop');
    const select = document.getElementById("camera-select");
    const canvas = document.getElementById('ascii-canvas');
    let currentStream;

    // helper function to stop a video stream
    function stopMediaTracks(stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          
        });
        video.hidden = true;
        canvas.hidden = true;
      }

    // stop button
    buttonStop.addEventListener('click',event =>{
        if (typeof currentStream !== 'undefined') {
            stopMediaTracks(currentStream);
        }else{
            throw new Error("No active camera stream");
        }
    });

    // get selection of cameras
    navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                devices.forEach(function(device) {
                    if (device.kind === "videoinput") {
                        console.log('Found video device: device-id:' + device.deviceId + '; device-label: ' + device.label + '; device-kind: ' + device.kind);
                        var option = document.createElement("option");
                        option.value = device.deviceId;
                        option.text = device.label || "Camera " + (select.length + 1);
                        select.appendChild(option);
                    }
                });
    }).catch(function(error){
        console.error("Error while retrieving video devices:", error);
    });
    
    // start button -> grab live camera feed
    buttonStart.addEventListener("click", function() {
        video.hidden = false;
        canvas.hidden = false;

        var selectedDeviceId = select.value;
        var constraints = {
        video: { deviceId: selectedDeviceId }
        };
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            video.srcObject = stream;
            currentStream = stream;
            video.play();

            // process the images of the live camera feed and do ascii magic
            console.log("Getting Camera live feed...");
            
            processVideo(video,canvas);
            console.log("Processing Frames...");
        })
        .catch(function(error) {
            console.error("Error accessing webcam:", error);
        });
  });







}); // end of DOMLOADED EVENT
