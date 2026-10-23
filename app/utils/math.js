export function lerp(start, end, amount) {
    return (1 - amount) * start + amount * end;
  }
  
  export function getMousePos(e) {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.clientX || e.clientY) {
      posx = e.clientX;
      posy = e.clientY;
    }
    return { x: posx, y: posy };
  }