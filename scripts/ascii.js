
// TODO do ascii image processing, add option to specify ascii gradient string, add option to render fotos instead of webcam feed

/**
 * 
 * @param {ImageData} imageData
 */

function convertToASCII(imageData){
    function greyScale(){
        for (j=0; j<imageData.height; j++)
        {
            for (i=0; i<imageData.width; i++)
            {
                var index=(j*4)*imageData.width+(i*4);
                var red=imageData.data[index];
                var green=imageData.data[index+1];
                var blue=imageData.data[index+2];
                var alpha=imageData.data[index+3];
                var average=(red+green+blue)/3;
                imageData.data[index]=average;
                imageData.data[index+1]=average;
                imageData.data[index+2]=average;
                imageData.data[index+3]=alpha; // we dont want to change opacity
            }
        }
    }

    greyScale();
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

        // we need to do a little hack to get the frames of the video stream and turn them into ascii art
        // we are going to use a offscreen canvas for this
        let offscreenCanvas = document.getElementById("offscreen-canvas");
        if (!offscreenCanvas) {
            offscreenCanvas = document.createElement("canvas");
            offscreenCanvas.hidden = true;
            document.body.appendChild(offscreenCanvas);
            offscreenCanvas.id = "offscreen-canvas";
        }
        const offscreenCtx = offscreenCanvas.getContext("2d");
        offscreenCtx.canvas.width = width;
        offscreenCtx.canvas.height = height;

        console.log("Processing Video height: " + height + "width: " + width);
        function renderFrame() {
            console.log("Rendering Frame...");
            //ctx.drawImage(video, 0, 0, width, height);

            offscreenCtx.drawImage(video, 0, 0, width, height); //draw video data on canvas
            let imageData = offscreenCtx.getImageData(0, 0, width, height); // get canvas data
            let data = imageData.data; // actual pixel data array - RGBA (red,green,blue,alpha) -> Uint8ClampedArray[width*height*4]

            // process data to convert each pixel to an ASCII character
            convertToASCII(imageData);

            // render ASCII text to the visible canvas
            ctx.putImageData(imageData, 0, 0);

            requestAnimationFrame(renderFrame); // efficient loop over frames
          }
          requestAnimationFrame(renderFrame); // start rendering
    });
}