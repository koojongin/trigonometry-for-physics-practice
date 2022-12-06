import {FPS} from "./constants";

export function toHHMMSS(time) {
  let sec_num = parseInt(time, 10); // don't forget the second param
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
}

export function getElapsedTime(time, fps) {
  return ((time / fps) / fps);
}

export function getElapsedSeconds(time, fps) {
  return Math.floor((time / fps) / fps);
}
