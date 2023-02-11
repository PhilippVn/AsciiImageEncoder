
// TODO do ascii image processing, add option to specify ascii gradient string, add option to render fotos instead of webcam feed


// source: http://paulbourke.net/dataformats/asciiart/
// https://marmelab.com/blog/2018/02/20/convert-image-to-ascii-art-masterpiece.html
// $ is darker than @ which is darker than B ans so on
// 0 = black would map to $ and 255(red = 255,green=255,blue=255) = white would map to space ->
const assciGradient = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
var shouldRender = false;

/**
 * 
 * @param {ImageData} imageData
 */
function convertToASCII(imageData){
    // first we need to greyscale the image

    // grey scales by weighting according to human color perception
    function greyScale(){
        const grayScales = []; // grayscale values
        for (j=0; j<imageData.height; j++)
        {
            for (i=0; i<imageData.width; i++) // lower resolution
            {
                var index=(j*4)*imageData.width+(i*4);
                var red=imageData.data[index];
                var green=imageData.data[index+1];
                var blue=imageData.data[index+2];
                var alpha=imageData.data[index+3];

                let weightedAvg = 0.2989 * red + 0.587 * green + 0.1130 * blue;
                grayScales.push(weightedAvg);
            }
        }
        return grayScales;
    }

    var grayScales = greyScale();
    

    // to turn the pixels into ascii chars we need to get a mapping of pixel brightness to ascii gradient index

    // greyscale is a value from 0 (black) to 255 (white)
    const getCharacterForGrayScale = grayScale => assciGradient[Math.floor(((assciGradient.length - 1) * grayScale/255))];


    const getAscii = grayScales => {
        let row = 0;
        let column = 0;
        // generate ascii string
        const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
            let nextChars = getCharacterForGrayScale(grayScale);
        
            if ((index + 1) % imageData.width === 0) {
              nextChars += "\n";
            }
        
            return asciiImage + nextChars;
          }, "");
        return ascii;
      };
    
    return getAscii(grayScales);
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

            offscreenCtx.drawImage(video, 0, 0, width, height); //draw video data on canvas
            let imageData = offscreenCtx.getImageData(0, 0, width, height); // get canvas data
            
            // process data to convert each pixel to an ASCII character
            const asciiString = convertToASCII(imageData);

            // render ASCII text to the visible canvas
            ctx.font = "5px monospace";
            var lines = asciiString.split("\n");
            ctx.clearRect(0, 0, width, height);
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], 0, i * 5);
            }

            if(shouldRender){ // only render next frame if it still should render
                requestAnimationFrame(renderFrame); // efficient loop over frames
            }
          }
          requestAnimationFrame(renderFrame); // start rendering
    });
}