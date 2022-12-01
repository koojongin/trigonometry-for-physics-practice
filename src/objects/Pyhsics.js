export function getAngle(_p1, _p2) {
  let p1 = {x: 0, y: 0};
  let p2 = {x: _p2.x - _p1.x, y: _p2.y - _p1.y};
  const firstAngle = Math.atan2(p2.y, p2.x);
  const secondAngle = Math.atan2(p1.y, p2.x);
  const angle = secondAngle - firstAngle;
  let degrees = (angle * 180) / Math.PI;
  if (p2.x < 0)
    degrees += 180;
  // degrees += 180;
  return degrees;
}

export function getVelocity(p1, p2) {
  const degrees = getAngle(p1, p2);
  const x = Math.cos(degrees * Math.PI / 180);
  // 캔버스 역좌표땜에 y축은 -붙여야함
  const y = -Math.sin(degrees * Math.PI / 180);
  return {
    x, y
  }
}