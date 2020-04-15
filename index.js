(function() {

function init() {
    var canvas = document.getElementsByTagName('canvas')[0];
    var c = canvas.getContext('2d');
    var sp = performance.now();

    var state = {
        ticks: 0, // increments by 1 each time data is processed
        ticksPerCycle: 99, // how many ticks for each stage
        stages: ["Inhale", "Hold", "Exhale", "Hold"], // distinct stages
        stageIdx: 0, // marks stage
        msTick: 25, // milliseconds per tick
        minRad: 20, // minimum radius
        radius: 1, // size of radius
        color: 0, // current color
        sp: performance.now(), // starting point (time)
        radiusX: 300, // x position of large circle
        radiusY: 300, // y position of large circle
        textX: 5, // x position of text
        textY: 595, // y position of text
        markerX: 150, // x position of marker
        markerY: 150, // y position of marker
    }

    function updateSP(state, sp) {
        state.sp = sp;
        return state;
    }

    function updateStage(state) {
        if (state.ticks == state.ticksPerCycle) {
            state.stageIdx++;
            if (state.stageIdx == 4) {
                state.stageIdx = 0;
            }
            state.ticks = 0;
        }
        state.ticks++;
        return state;
    }
    
    function updateRadius(state) {
        switch (state.stages[state.stageIdx]) {
            case "Inhale":
                state.radius++;
                break;
            case "Exhale":
                state.radius--;
                break;
        }

        return state;
    }

    function updateMarker(state) {
        switch(state.stageIdx) {
            case 0:
                state.markerX += 3;
                break;
            case 1:
                state.markerY += 3;
                break;
            case 2:
                state.markerX -= 3;
                break;
            case 3:
                state.markerY -= 3;
                break;
        }
        return state;
    }
    
    function drawArc(ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI, false);
        ctx.fill();
    }
    
    function render(state) {
        c.fillStyle = '#000000';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = 'hsl(' + state.color++ + ',100%,50%)';
        drawArc(c, state.radiusX, state.radiusY, state.radius+state.minRad);
        c.fillStyle = '#FFFFFF';
        drawArc(c, state.radiusX-150, state.radiusY-150, state.minRad);
        drawArc(c, state.radiusX+150, state.radiusY-150, state.minRad);
        drawArc(c, state.radiusX+150, state.radiusY+150, state.minRad);
        drawArc(c, state.radiusX-150, state.radiusY+150, state.minRad);
        // draw marker
        c.fillStyle = '#C2C5CC';
        c.beginPath();
        c.arc(state.markerX, state.markerY, state.minRad, 0, 2*Math.PI, false);
        c.fill();
        // draw font
        c.font = "30px Arial";
        c.fillStyle = '#FFFFFF';
        c.fillText(state.stages[state.stageIdx], state.textX, state.textY);
    }

    function draw() {
        var rt = performance.now();
        // msTick = milliseconds per tick
        // currently 100 ticks per cycle == 4 seconds.
        if (rt - state.sp > state.msTick) {
            state = updateStage(state);
            state = updateRadius(state);
            state = updateSP(state, rt);
            state = updateMarker(state);
        }
        render(state);
        requestAnimationFrame(draw);
    }

    draw();
}

window.addEventListener('load', init, false);

}()); // self invoking function
