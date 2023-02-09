const canvas = document.getElementById('ascii-canvas');

// TODO do ascii image processing, add option to specify ascii gradient string, add option to render fotos instead of webcam feed

function convertToASCII(imageData){

}

function drawASCIIImage(asciiData){

}

/**
 * @param {MediaStream} stream
 */
function processVideo(stream) {
    // Get the video frame and convert it to ASCII
    const imageData = getVideoFrame();
    const asciiData = convertToASCII(imageData);
    
    // Draw the ASCII image onto the canvas
    drawASCIIImage(asciiData);
    
    // Repeat the process for the next video frame
    requestAnimationFrame(processVideo);
  }