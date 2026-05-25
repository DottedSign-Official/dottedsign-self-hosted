export function fullScreenEvent(callback) {
  const document = window.document;

  document.addEventListener("webkitfullscreenchange", callback, false);
  document.addEventListener("mozfullscreenchange", callback, false);
  document.addEventListener("fullscreenchange", callback, false);
}

export function toggleFullScreen() {
  const document = window.document;

  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

export function parseDatetime(datetime) {
  const d = new Date(datetime);
  const month = d.getMonth() + 1;
  return `${d.getFullYear()}-${month}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

export const isPhone = (phone) => {
  const reg = /^\+?[0-9]{1,4}[-]{1}[0-9]{7,11}$/;
  return reg.test(phone);
};

export const isTaiwanPhone = (phone) => {
  const reg = /^\+886-9[0-9]{8}$/;
  return reg.test(phone);
};

export const isEmail = (email) => {
  if (!email) {
    return false;
  }

  const filter = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return filter.test(email);
};
