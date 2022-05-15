const seeker_score_template_ids = ['restart-btn', 'violation-btn', 'restart-count', 'violation-count', 'complete-btn'] +
    ['ball-1-btn', 'ball-2-btn', 'ball-3-btn'] +
    ['A', 'B', 'C', 'D', 'E'].map(({chr})=>chr+"-break-btn") +
    ['A', 'B', 'C', 'D', 'E'].map(({chr})=>chr+"-pick-btn") +
    ['A', 'B', 'C', 'D', 'E'].map(({chr})=>chr+"-place-btn") +
    ["place-btn"];
const hitter_score_template_ids =  ['restart-btn', 'violation-btn', 'restart-count', 'violation-count', 'complete-btn'] 
    ["collected-counter", "collected-add", "collected-minus",
     "passed-counter", "passed-add", "passed-minus",
     "thrown-counter", "thrown-add", "thrown-minus"];

function seeker_score_template(id) {
    id = id + '-';
    return `
    <div class="flex flex-row justify-between m-auto w-[84%]">
        <table class="w-[55%]">
            <tr>
            <td>
                <button id="${id+"seeker-restart-btn"}" class="restart-vio-button inline-block float-left" oncontextmenu="event.preventDefault();">RESTART</button>
                <p id="${id+"seeker-restart-count"}" class="restart-vio-text inline-block float-right">0</p></td>
            </tr>
            <tr>
            <td>                      
                <button id="${id+"seeker-violation-btn"}" class="restart-vio-button inline-block float-left" oncontextmenu="event.preventDefault();">VIOLATION</button>
                <p id="${id+"seeker-violation-count"}" class="restart-vio-text inline-block float-right">0</p>
            </td>
            </tr>
        </table>
        <button id="${id+"seeker-complete-btn"}" class="end-button pointer-events-none">BUILT</button>
        </div>
        
        <div class="flex flex-row my-3">
    
        <table class="text-center items-center w-[100%]">
            <!-- lagori sizes: 20, 27.5, 35, 42.5, 50 -->
            <tr>
            <td class="criteria-text px-2">Balls</td>
            <td class="criteria-text">Lagori Tower</td>
            <td class="criteria-text">Break</td>
            <td id="${id+"place-btn"}" class="criteria-text">Pick</td>
            <td><button class="criteria-text underline">Place</button></td>
            </tr><tr>
            <td rowspan="5">
                <div class="flex flex-col items-center">
                <button id="${id+"ball-1-btn"}" class="ball-unclicked">1</button>
                <button id="${id+"ball-2-btn"}" class="ball-unclicked">2</button>
                <button id="${id+"ball-3-btn"}" class="ball-unclicked">3</button>
                </div>
            </td>
            <td class="flex justify-center"><svg width="100" height="30">
                <rect x="30" y="1" width="40" height="28" stroke="blue" fill="transparent" stroke-width="1"/>
                <text x="50" y="22" style="font: 20px sans-serif; white-space: pre-line; text-anchor: middle;">A</text>
            </svg></td>
            <td><button id="${id+"A-break-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"A-pick-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"A-place-btn"}" class="ok">OK</button></td>
            </tr><tr>
            <td class="flex justify-center"><svg width="100" height="30">
                <rect x=22.5 y="1" width="55" height="28" stroke="red" fill="transparent" stroke-width="1"/>
                <text x="50" y="22" style="font: 20px sans-serif; white-space: pre-line; text-anchor: middle;">B</text>
            </svg></td>
            <td><button id="${id+"B-break-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"B-pick-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"B-place-btn"}" class="ok">OK</button></td>
            </tr><tr>
            <td class="flex justify-center"><svg width="100" height="30">
                <rect x=15 y="1" width="70" height="28" stroke="blue" fill="transparent" stroke-width="1"/>
                <text x="50" y="22" style="font: 20px sans-serif; white-space: pre-line; text-anchor: middle;">C</text>
            </svg></td>
            <td><button id="${id+"C-break-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"C-pick-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"C-place-btn"}" class="ok">OK</button></td>
            </tr><tr>
            <td class="flex justify-center">
                <svg width="100" height="30"><rect x=7.5 y="1" width="85" height="28" stroke="red" fill="transparent" stroke-width="1"/>
                <text x="50" y="22" style="font: 20px sans-serif; white-space: pre-line; text-anchor: middle;">D</text>
            </svg></td>
            <td><button id="${id+"D-break-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"D-pick-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"D-place-btn"}" class="ok">OK</button></td>
            </tr><tr>
            <td class="flex justify-center">
                <svg width="100" height="30"><rect x=0 y="1" width="100" height="28" stroke="blue" fill="transparent" stroke-width="1"/>
                <text x="50" y="22" style="font: 20px sans-serif; white-space: pre-line; text-anchor: middle;">E</text>
            </svg></td>
            <td><button id="${id+"E-break-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"E-pick-btn"}" class="ok">OK</button></td>
            <td><button id="${id+"E-place-btn"}" class="ok">OK</button></td>
            </tr>
        </table>
        </div>
    `
};

function hitter_score_template(id) {
    id = id + "-";
    return `
    <div class="flex flex-row justify-between w-[84%]">
    <table class="w-[55%]">
        <tr>
        <td>
            <button id="${id+"hitter-restart-btn"}" class="restart-vio-button inline-block float-left" oncontextmenu="event.preventDefault();">RESTART</button>
            <p id="${id+"hitter-restart-count"}" class="restart-vio-text inline-block float-right">0</p></td>
        </tr>
        <tr>
        <td>                      
            <button id="${id+"hitter-violation-btn"}" class="restart-vio-button inline-block float-left" oncontextmenu="event.preventDefault();">VIOLATION</button>
            <p id="${id+"hitter-violation-count"}" class="restart-vio-text inline-block float-right">0</p>
        </td>
        </tr>
    </table>
    <button id="${id+"hitter-complete-btn"}" class="end-button">HIT</button>
    </div>

    <div class="my-3">

    <table class="text-center items-center w-[100%] >lg:table-fixed">
        <tr>
        <td rowspan="3" class="w-[19%]">
            <p class="criteria-text">Balls</p>
            <div class="ball m-auto my-3"></div>
        </td>
        <td class="w-[27%]"><span class="criteria-text block">Collected</span>
            <span id="${id+"collected-counter"}" class="text-size-[40px] text-center font-bold block">0</span></td>
        <td class="w-[27%]"><span class="criteria-text block">Passed</span>
            <span id="${id+"passed-counter"}" class="text-size-[40px] text-center font-bold block">0</span></td>
        <td class="w-[27%]"><span class="criteria-text block">Thrown</span>
            <span id="${id+"thrown-counter"}" class="text-size-[40px] text-center font-bold block">0</span></td>
        </tr>
        <tr>
        <td><button id="${id+"collected-plus"}" class="green-btn">+1</button></td>
        <td><button id="${id+"passed-plus"}" class="green-btn">+1</button></td>
        <td><button id="${id+"thrown-plus"}" class="green-btn">+1</button></td>
        </tr>
        <tr>
        <td><button id="${id+"collected-minus"}" class="red-btn">-1</button></td>
        <td><button id="${id+"passed-minus"}" class="red-btn">-1</button></td>
        <td><button id="${id+"thrown-minus"}" class="red-btn">-1</button></td>
        </tr>
    </table>
    </div>
    `;
};

export {seeker_score_template, hitter_score_template};