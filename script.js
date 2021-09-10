// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./assets/teachablemachinemodel/";
const tags = ["nan-blh", "nan-hlh", "nv-df", "nv-zcf", "nv-cf", "nan-df"];
const imgUrls = {
  "nan-df": [
    "./assets/jieguo/nan-df/df.png",
    "./assets/jieguo/nan-df/df2.png",
    "./assets/jieguo/nan-df/df3.png",
    "./assets/jieguo/nan-df/df4.png",
    "./assets/jieguo/nan-df/df5.png",
  ],
  "nan-hlh": [
    "./assets/jieguo/nan-hlh/hlh.png",
    "./assets/jieguo/nan-hlh/hlh2.png",
    "./assets/jieguo/nan-hlh/hlh3.png",
    "./assets/jieguo/nan-hlh/hlh4.png",
    "./assets/jieguo/nan-hlh/hlh5.png",
  ],
  "nan-blh": [
    "./assets/jieguo/nan-blh/blh (1).png",
    "./assets/jieguo/nan-blh/blh (2).png",
    "./assets/jieguo/nan-blh/blh (3).png",
    "./assets/jieguo/nan-blh/blh (4).png",
    "./assets/jieguo/nan-blh/blh (5).png",
  ],
  "nv-df": [
    "./assets/jieguo/nv-df/df.png",
    "./assets/jieguo/nv-df/df2.png",
    "./assets/jieguo/nv-df/df3.png",
    "./assets/jieguo/nv-df/df4.png",
    "./assets/jieguo/nv-df/df5.png",
  ],
  "nv-cf": [
    "./assets/jieguo/nv-cf/cf.png",
    "./assets/jieguo/nv-cf/cf2.png",
    "./assets/jieguo/nv-cf/cf 3.png",
    "./assets/jieguo/nv-cf/cf 4.png",
    "./assets/jieguo/nv-cf/cf 5.png",
  ],
  "nv-zcf": [
    "./assets/jieguo/nv-zcf/zcf.png",
    "./assets/jieguo/nv-zcf/zcf2.png",
    "./assets/jieguo/nv-zcf/zcf3.png",
    "./assets/jieguo/nv-zcf/zcf4.png",
    "./assets/jieguo/nv-zcf/zcf5.png",
  ],
};
let model, webcam, labelContainer, maxPredictions;
let isIos = false;
// fix when running demo in ios, video will be frozen;
if (
  window.navigator.userAgent.indexOf("iPhone") > -1 ||
  window.navigator.userAgent.indexOf("iPad") > -1
) {
  isIos = true;
}

let cameraLoop = true;
// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  console.log(model);
  $(".retakephoto").hide();
  $(".takephotook").hide();
  cameraLoop = true;
  const flip = false;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();
  await webcam.play();
  addCanvas("webcam-container");
  window.requestAnimationFrame(camloop);
  // predict(webcam.canvas);
}

// run the webcam image through the image model
async function predict(img) {
  // predict can take in an image, video or canvas html element
  // console.log(webcam.canvas);
  const prediction = await model.predict(img);
  console.log(JSON.stringify(prediction));
  return prediction;
}

function addCanvas(id) {
  if (isIos) {
    document.getElementById(id).appendChild(webcam.webcam); // webcam object needs to be added in any case to make this work on iOS
    // grab video-object in any way you want and set the attributes
    const webCamVideo = document.getElementsByTagName("video")[0];
    webCamVideo.setAttribute("playsinline", true); // written with "setAttribute" bc. iOS buggs otherwise
    webCamVideo.muted = "true";
    webCamVideo.style.width = width + "px";
    webCamVideo.style.height = height + "px";
  } else {
    document.getElementById(id).appendChild(webcam.canvas);
  }
}

$(window).on("load", async () => {
  init();
});

async function camloop() {
  if (cameraLoop) await webcam.update(); // update the webcam frame

  window.requestAnimationFrame(camloop);
}

//button event

$(".btn-webcam").on("click", async () => {
  console.log("cil");
  $(".wcpanel").css("display", "flex");
});
$(".takephoto").on("click", async () => {
  cameraLoop = false;
  $(".takephoto").hide();
  $(".retakephoto").show();
  $(".takephotook").show();
});
$(".retakephoto").on("click", async () => {
  $(".takephoto").show();
  cameraLoop = true;

  $(".retakephoto").hide();
  $(".takephotook").hide();
});
$(".takephotook").on("click", async () => {
  $(".wcpanel").hide();
  const prediction = await predict(webcam.canvas);
  console.log(prediction);
  let max = 0;
  let maxid = 0;
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability >= max) {
      max = prediction[i].probability;
      maxid = i;
    }
  }

  // function random() {
  //     var x = Math.sin(seed++) * 10000;
  //     return x - Math.floor(x);
  // }
  let url = imgUrls[tags[maxid]][Math.floor(Math.random() * 5)];
  $("#final").attr("src", url);
  console.log(maxid);
  for (let i = 0; i < maxPredictions; i++) {
    $(".tables")
      .append(
        "<p>" +
          prediction[i].className +
          ":  " +
          prediction[i].probability.toFixed(2) +
          "</p>"
      )
      .append(
        ' <div style="width: ' +
          prediction[i].probability * 100 +
          '%; height: 20px; background-color: #B5A572;"></div>'
      );

    // const classPrediction =
    //   prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    // labelContainer.childNodes[i].innerHTML = classPrediction;
  }
  addCanvas("reslutphoto");
  $(".resultpanel").show();
});

$(".download").on("click", async () => {
  downloadImage($("#final").attr("src"));
});
$(".retry").on("click", async () => {
  // $(".wcpanel").show();
  $(".resultpanel").hide();
  addCanvas("webcam-container");
  $(".tables").empty();
  $("#reslutphoto").empty();
  $(".retakephoto").trigger("click");
});
function downloadImage(src) {
  const $a = $("<a></a>").attr("href", src).attr("download", "你的身份.png");
  $a[0].click();
}
let reader = new FileReader();
let img = new Image();
const canvas = document.createElement("canvas");
canvas.width = 200;
canvas.height = 200;
document
  .getElementById("fileupload")
  .addEventListener("change", async function (event) {
    reader.readAsDataURL(event.target.files[0]);
  });
reader.onload = async function (e) {
  img.src = e.target.result;
};

img.onload = async function () {
  console.log(img.width);
  console.log(img.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 200, 200);
  $("#reslutphoto").append(img);
  $("#reslutphoto>img").attr("height", "200");
  const prediction = await predict(img);
  console.log(prediction);
  let max = 0;
  let maxid = 0;
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability >= max) {
      max = prediction[i].probability;
      maxid = i;
    }
  }
  let url = imgUrls[tags[maxid]][Math.floor(Math.random() * 5)];
  $("#final").attr("src", url);
  console.log(maxid);
  for (let i = 0; i < maxPredictions; i++) {
    $(".tables")
      .append(
        "<p>" +
          prediction[i].className +
          ":  " +
          prediction[i].probability.toFixed(2) +
          "</p>"
      )
      .append(
        ' <div style="width: ' +
          prediction[i].probability * 100 +
          '%; height: 20px; background-color: #B5A572;"></div>'
      );
  }
  $(".resultpanel").show();
};
