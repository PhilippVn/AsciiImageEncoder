
var should_encode = true;

// TODO do ascii image processing, add option to specify ascii gradient string, add option to render fotos instead of webcam feed

function convertToASCII(imageData){

}

function drawASCIIImage(asciiData){

}

/**
 * @param {HTMLVideoElement} video
 * @param {HTMLCanvasElement} canvas
 */
function processVideo(video, canvas) {
    let ctx = canvas.getContext("2d");

    video.addEventListener("loadedmetadata",function(){
        const height = this.videoHeight;
        const width = this.videoWidth;

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        video.controls = true;

        console.log("Processing Video height: " + height + "width: " + width);
        function renderFrame() {
            console.log("Rendering Frame...");
            ctx.drawImage(video, 0, 0, width, height);
            requestAnimationFrame(renderFrame);
          }
          requestAnimationFrame(renderFrame); // efficient loop over frames
    });
}