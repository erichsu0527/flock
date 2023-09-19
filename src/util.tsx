
export const rotate = (x: number, y: number, c: number, s: number) => {
    return [
        x * c - y * s,
        x * s + y * c
    ];
}

export const degree2radian = (degrees: number) => {
    return degrees * Math.PI / 180;
}

/**
 * source: https://gist.github.com/starfys/aaaee80838d0e013c27d
 */
export function inv_sqrt(n:number)
{ 
    var i;
    var x2, y;
    const threehalfs = 1.5;
  
    x2 = n * 0.5;
    y = n;
    //evil floating bit level hacking
    var buf = new ArrayBuffer(4);
    (new Float32Array(buf))[0] = n;
    i =  (new Uint32Array(buf))[0];
    i = (0x5f3759df - (i >> 1)); //What the fuck?
    (new Uint32Array(buf))[0] = i;
    y = (new Float32Array(buf))[0];
    y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//  y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

    return y;
}