let video = document.getElementById("lesson-1");
let start,
  end = 0;
let logoutBtn = document.getElementById("logout-btn");

window.addEventListener("load", function () {
  let user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "/login.html";
  }
  let data = { userId: user, videoId: "lesson-1" };
  $.get("/video", data, function (response) {
    let theEnd = response.data.segments[response.data.segments.length - 1];
    video = document.getElementById(response.data.videoId);
    video.currentTime = theEnd.end;
    updateProgress(Math.floor(response.data.progress));
  });
});

video.addEventListener("pause", function () {
   if (!(video.playbackRate > 1.0)) {
  saveVideoProgress(video);
}
 
});
video.addEventListener("play", function () {
   if (!(video.playbackRate > 1.0)) {
  updateVideoProgress(video);
   }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  alert("You have been logged out.");
  window.location.href = "/login.html";
});

function saveVideoProgress(video) {
  end = Math.floor(video.currentTime);
  let data = { start: start, end: end, duration: Math.floor(video.duration) };
  $.post("/video", data, function (response) {
    updateProgress(Math.floor(response.data.progress));
  });
}

function updateVideoProgress(video, videoId) {
  start = Math.floor(video.currentTime);
}

function updateProgress(percent) {
  const ring = document.querySelector(".progress-ring");
  const label = ring.querySelector(".progress-label");

  // Update CSS variable
  ring.style.setProperty("--percentage", percent);

  // Update the label text
  label.textContent = `${percent}%`;
}
