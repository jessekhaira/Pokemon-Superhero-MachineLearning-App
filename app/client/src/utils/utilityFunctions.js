
/**
 * This function accepts two integers, and returns a random integer in between the two
 * integers. 
 * @param {Number} min 
 * @param {Number} max 
 */
export function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min; 
}

/**
 * This function expects args[i] to be an array where the first element is an object
 * and the second element is the expected width of this object in %.
 */
export function animateWidthGrowing(...args) {
    // reset the widths of all the elements to 0% so we can animate correctly
    for (let arg of args) {
        arg[0].style.width = '0%'; 
    }
    function animate() {
        // if every single animation is done, every animation will return true
        // if even one animation returns false, we continue on
        let allAnimsDone = true;
        for (let arg of args) {
            allAnimsDone &= grow_width(arg[0], arg[1]);
        }
        if (!allAnimsDone) {
            requestAnimationFrame(animate);
        }  
    }
    animate(); 
}

/**
 * This function grows an obj's width by 1%, until the objects width is >= to the
 * max_width. Meant to be used inside an animation.
 */
function grow_width(obj, max_width) {
    const obj_width_in_percent = getObjWidthInPercent(obj);
    if (obj_width_in_percent >= Number(max_width)) {
        return true;
    }
    obj.style.width = `${obj_width_in_percent+2}%`;
    return false; 
}


/**
 * This function accepts a DOM node as input, and returns an integer representing the nodes width
 * in percent. 
 * @param {HTMLElement} obj DOM node whose width you want to get in %
 */
function getObjWidthInPercent(obj) {
    const obj_width = obj.clientWidth;
    const parent_width = obj.parentElement.clientWidth;
    const width_in_percent =Math.ceil((obj_width/parent_width) *100);
    return width_in_percent; 
}
