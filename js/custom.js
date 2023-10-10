console.log('Custom.js Added.')


// Paths of images
let baseurl = "images/"
let black = []
let white = []

const defaultElms = [
    {
        elmName: "left_hathi",
        path: "br.png",
        pos: [0, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "left_ghoda",
        path: "bn.png",
        pos: [1, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "left_camel",
        path: "bb.png",
        pos: [2, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "queen",
        path: "bq.png",
        pos: [3, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "king",
        path: "bk.png",
        pos: [4, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "right_camel",
        path: "bb.png",
        pos: [5, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "right_ghoda",
        path: "bn.png",
        pos: [6, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "right_hathi",
        path: "br.png",
        pos: [7, 0],
        live: true,
        color: 'black'
    },
    {
        elmName: "left_hathi",
        path: "wr.png",
        pos: [0, 7],
        live: true,
        color: "white"
    },
    {
        elmName: "left_ghoda",
        path: "wn.png",
        pos: [1, 7],
        live: true,
        color: "white"
    },
    {
        elmName: "left_camel",
        path: "wb.png",
        pos: [2, 7],
        live: true,
        color: "white"
    },
    {
        elmName: "queen",
        path: "wq.png",
        pos: [3, 7],
        live: true,
        color: "white"
    },
    {
        elmName: "king",
        path: "wk.png",
        pos: [4, 7],
        live: true,
        color: "white"
    },
    {
        elmName: "right_camel",
        path: "wb.png",
        pos: [5, 7],
        live: true,
        color: "white"
    },
    {
        elmName: "right_ghoda",
        path: "wn.png",
        pos: [6, 7],
        live: true,
        color: "white"
    },
    {
        elmName: "right_hathi",
        path: "wr.png",
        pos: [7, 7],
        live: true,
        color: "white"
    }
]

let stepNumber = 0
let stepsLogs = []

let allElms = JSON.parse(JSON.stringify(defaultElms))




let currentActionOwner = "white"
let currentSelectedElm = {}


// Create ChessBord
let createBoard = async () => {
    let currentClass = "whiteBG"
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (x % 2 == 0) {
                if (y % 2 == 0) {
                    currentClass = "whiteBG"
                } else {
                    currentClass = "blackBG"
                }
            } else {
                if (y % 2 == 0) {
                    currentClass = "blackBG"
                } else {
                    currentClass = "whiteBG"
                }
            }
            let chessBlock = `
                <div class="chessBlock ${currentClass}" blockid="[${x}, ${y}]">
                    <p class="showonhover">[${x}, ${y}]</p>
                </div>`;
            $(".chessBordParent").append(chessBlock);
        }
    }

    // Add Barb in Black and White
    for (let i = 0; i < 8; i++) {
        let black_barb = {
            elmName: `barb${i}`,
            path: "bp.png",
            pos: [i, 1],
            live: true,
            color: "black"
        }
        let white_barb = {
            elmName: `barb${i}`,
            path: "wp.png",
            pos: [i, 6],
            live: true,
            color: "white"
        }
        allElms.push(black_barb)
        allElms.push(white_barb)

        defaultElms.push(black_barb)
        defaultElms.push(white_barb)

    }

    // Append elms on bord
    allElms.forEach(elmData => {
        // console.log(elmData)
        let chessBlock = `
        <div class="chessBlock canaccess" dataElmName="${btoa(elmData.elmName)}" 
        dataElmC="${btoa(elmData.color)}">
            <img src="${baseurl}${elmData.path}" class="chesselm" >
        </div>`;
        $(".chessBordController").append(chessBlock);
        arrangePosElms(elmData)

    })


    resetBoard()
    // if (localStorage.getItem("lastMoves") != null) {
    //     loadLastGame()
    // } else {
    //     resetBoard()
    // }


}

// Reset all elements position & score
let resetBoard = () => {
    allElms = JSON.parse(JSON.stringify(defaultElms))
    allElms.forEach(elmData => {
        arrangePosElms(elmData)
    })
    $('.canaccess.active').removeClass('clicked')
    $(".chessBordController .hint_b").remove();
    $(".canaccess").addClass("active")
}

let loadLastGame = () => {
    allElms = JSON.parse(localStorage.getItem("lastMoves"))
    allElms.forEach(elmData => {
        arrangePosElms(elmData)
    })
    currentActionOwner = localStorage.getItem("currentActionOwner")
    $('.canaccess.active').removeClass('clicked')
    $(".chessBordController .hint_b").remove();
    $(".canaccess").removeClass("active")
    $(`[dataElmC="${btoa(currentActionOwner)}"]`).addClass("active")
}

// Arrange or update Positions
let arrangePosElms = (elmData) => {
    let encElmName = btoa(elmData.elmName)
    let encElmColor = btoa(elmData.color)
    $(`[dataElmName="${encElmName}"][dataElmC="${encElmColor}"]`).attr("style", `transform: translate(${elmData.pos[0]}00%,${elmData.pos[1]}00%);`);
}

// Create Hint or Show Path
let createHintElms = (hintPath, hintType, hintForElm) => {
    let hintTypeCLass = "hint"
    if (hintType == "open") {
        hintTypeCLass = "hint"
    } else if (hintType == "kill") {
        hintTypeCLass = "capture-hint"
    }
    let hintBlock = `
        <div class="chessBlock hint_b ${hintTypeCLass}" path="${hintPath}" 
        style="transform: translate(${hintPath[0]}00%,${hintPath[1]}00%);"></div>`;
    $(".chessBordController").append(hintBlock);
}

let checkElmsOnPath = async (hintPath, hintForElm) => {
    let callBack = {
        blockPresnt: false
    }
    let results = await allElms.filter(obj => {
        if (obj.pos[0] == hintPath[0] && obj.pos[1] == hintPath[1]) {
            let index = allElms.indexOf(obj)
            obj.index = index
            let canKill = true
            if (hintForElm.color == obj.color) {
                canKill = false
            }
            callBack = {
                blockPresnt: true,
                canKill: canKill,
                blockData: obj
            }
            return callBack
        }
    });
    return callBack

}


let showMovementPaths = async (elmName, elmColor) => {
    // console.log(elmName, elmColor)
    $(".chessBordController .hint_b").remove();
    let elmData = await currentElemAllData(elmName, elmColor)
    console.log(elmData)
    currentSelectedElm = elmData
    // For Barbarian
    if (elmName.includes("barb")) {
        let fistStepBarb = 1
        let hintType = "open"
        if ((elmData.pos[1] == 1 && elmData.color == "black") || (elmData.pos[1] == 6 && elmData.color == "white")) {
            fistStepBarb = 2
        }
        // Barb Movement
        for (let i = 1; i <= fistStepBarb; i++) {
            let breakAfterComplete = false
            let hintPath
            if (elmColor == "white") {
                hintPath = [elmData.pos[0], elmData.pos[1] - i]
            } else {
                hintPath = [elmData.pos[0], elmData.pos[1] + i]
            }
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = "kill"
                    break;
                } else {
                    break;
                }
            } else {
                hintType = "open"
            }
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        // Barb Cross Kill
        for (let i = 1; i <= 1; i++) {
            let hintPath = []
            for (let x = 1; x <= 1; x++) {
                if (elmColor == "white") {
                    hintPath.push([elmData.pos[0] - x, elmData.pos[1] - i])
                    hintPath.push([elmData.pos[0] + x, elmData.pos[1] - i])
                } else {
                    hintPath.push([elmData.pos[0] - x, elmData.pos[1] + i])
                    hintPath.push([elmData.pos[0] + x, elmData.pos[1] + i])
                }
            }
            // 
            for (let x = 0; x < hintPath.length; x++) {
                let pathAccess = await checkElmsOnPath(hintPath[x], elmData)
                if (pathAccess.blockPresnt == true) {
                    if (pathAccess.canKill == true) {
                        hintType = "kill"
                        createHintElms(hintPath[x], hintType, elmData)
                    }

                }
            }
        }
    } else if (elmName.includes("hathi")) {
        let hintType = "open"

        // For up and down
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let hintPath = [elmData.pos[0], i]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let hintPath = [elmData.pos[0], i]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        // let hintType = "open"
        // For left and right
        for (let i = elmData.pos[0] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let hintPath = [i, elmData.pos[1]]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        for (let i = elmData.pos[0] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let hintPath = [i, elmData.pos[1]]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }

    } else if (elmName.includes("camel")) {
        let hintType = "open"
        let ycounter = 1
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] - ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        ycounter = 1
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] + ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }

        ycounter = 1
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] + ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        ycounter = 1
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] - ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }  
    } else if (elmName.includes("ghoda")) {
        let hintType = "open"
        let hintPath = []
        let allGodaPaths = []
        //Check Left 
        hintPath = [elmData.pos[0]-2, elmData.pos[1]+1]
        allGodaPaths.push(hintPath)
        hintPath = [elmData.pos[0]-2, elmData.pos[1]-1]
        allGodaPaths.push(hintPath)

        //Check Top 
        hintPath = [elmData.pos[0]+1, elmData.pos[1]-2]
        allGodaPaths.push(hintPath)
        hintPath = [elmData.pos[0]-1, elmData.pos[1]-2]
        allGodaPaths.push(hintPath)

        //Check Right
        hintPath = [elmData.pos[0]+2, elmData.pos[1]+1]
        allGodaPaths.push(hintPath)
        hintPath = [elmData.pos[0]+2, elmData.pos[1]-1]
        allGodaPaths.push(hintPath)

        //Check Bottom 
        hintPath = [elmData.pos[0]+1, elmData.pos[1]+2]
        allGodaPaths.push(hintPath)
        hintPath = [elmData.pos[0]-1, elmData.pos[1]+2]
        allGodaPaths.push(hintPath)

        console.log(allGodaPaths)

        for(let x= 0; x< allGodaPaths.length; x++){
            // console.log(allGodaPaths[x])
            if(allGodaPaths[x][0]>=0 && allGodaPaths[x][1]>=0 && allGodaPaths[x][0]<8 && allGodaPaths[x][1]<8){
                let canTrigger = true
                let pathAccess = await checkElmsOnPath(allGodaPaths[x], elmData)
                if (pathAccess.blockPresnt == true) {
                    if (pathAccess.canKill == true) {
                        hintType = await "kill"
                    } else {
                        canTrigger = false
                    }
                }else {
                    hintType = await "open"
                }
                if(canTrigger)
                createHintElms(allGodaPaths[x], hintType, elmData)
            }
        }
        
        
    } else if (elmName.includes("queen")) {


        let hintType = "open"
        let ycounter = 1
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] - ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        ycounter = 1
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] + ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }

        ycounter = 1
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] + ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        ycounter = 1
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] - ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }  

        hintType = "open"

        // For up and down
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let hintPath = [elmData.pos[0], i]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let hintPath = [elmData.pos[0], i]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        // let hintType = "open"
        // For left and right
        for (let i = elmData.pos[0] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let hintPath = [i, elmData.pos[1]]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
        for (let i = elmData.pos[0] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let hintPath = [i, elmData.pos[1]]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
        }
    } else if (elmName.includes("king")) {


        let hintType = "open"
        let ycounter = 1
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] - ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }

            break
        }
        ycounter = 1
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] + ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
            break
        }

        ycounter = 1
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] + ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
            break
        }
        ycounter = 1
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let customPoseSide = elmData.pos[0] - ycounter
            let hintPath = [customPoseSide, i]
            if(customPoseSide < 0 || customPoseSide >= 8){
                break
            }
            ycounter ++
            
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
            break
        }  

        hintType = "open"

        // For up and down
        for (let i = elmData.pos[1] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let hintPath = [elmData.pos[0], i]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
            break
        }
        for (let i = elmData.pos[1] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let hintPath = [elmData.pos[0], i]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
            break
        }
        // let hintType = "open"
        // For left and right
        for (let i = elmData.pos[0] - 1; i >= 0; i--) {
            let breakAfterComplete = false
            let hintPath = [i, elmData.pos[1]]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            // console.log(hintPath, hintType, elmData)
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
            break
        }
        for (let i = elmData.pos[0] + 1; i < 8; i++) {
            let breakAfterComplete = false
            let hintPath = [i, elmData.pos[1]]
            let pathAccess = await checkElmsOnPath(hintPath, elmData)
            if (pathAccess.blockPresnt == true) {
                if (pathAccess.canKill == true) {
                    hintType = await "kill"
                    breakAfterComplete = true;
                } else {
                    break;
                    breakAfterComplete = true;
                }
            }else {
                hintType = await "open"
            }
            createHintElms(hintPath, hintType, elmData)
            if (breakAfterComplete) { break }
            break
        }
    }
    
}

let currentElemAllData = async (elmName, elmColor) => {
    let results = await allElms.filter(obj => {
        if (obj.elmName == elmName && obj.color == elmColor) {
            let index = allElms.indexOf(obj)
            obj.index = index
            return obj
        }
    });
    return results[0]
}


let saveToLocal = async () => {
    localStorage.setItem("lastMoves", JSON.stringify(allElms))
    localStorage.setItem("currentActionOwner", currentActionOwner)
    stepNumber++

    if (localStorage.getItem("stepsLogs") != null) {
        stepsLogs = localStorage.getItem("stepsLogs")
    } else {
        stepsLogs.push(allElms)
    }
    // localStorage.setItem("stepsLogs", JSON.stringify(stepsLogs))
    // localStorage.setItem("stepNumber", stepNumber)


}

let updateElmDym = async (selectedElmData, elmPath, actionData) => {
    if (actionData == "move") {
        let elmData = selectedElmData
        let newPath = elmPath
        let encElmName = btoa(selectedElmData.elmName)
        let encElmColor = btoa(selectedElmData.color)
        let currentElmTag = $(`[dataElmName="${encElmName}"][dataElmC="${encElmColor}"]`)

        // Remove Clicked and Hints
        currentElmTag.removeClass("clicked")
        $(".chessBordController .hint_b").remove();

        // Move current Elm
        currentElmTag.attr("style", `transform: translate(${newPath[0]}00%,${newPath[1]}00%);`);
        let index = allElms.indexOf(elmData)
        allElms[index].pos = newPath


        // Change nextAction owner
        if (selectedElmData.color == "white") {
            currentActionOwner = "black"
        } else {
            currentActionOwner = "white"
        }

        // saveToLocal()

        $(".canaccess").removeClass("active")
        $(`[dataElmC="${btoa(currentActionOwner)}"]`).addClass("active")

        currentSelectedElm = {}

    } else if (actionData == "die") {
        let elmData = selectedElmData
        let encElmName = btoa(selectedElmData.elmName)
        let encElmColor = btoa(selectedElmData.color)
        let currentElmTag = $(`[dataElmName="${encElmName}"][dataElmC="${encElmColor}"]`)

        // Move current Elm
        newPath = [-10, -10]
        currentElmTag.attr("style", `transform: translate(${newPath[0]}00%,${newPath[1]}00%);`);
        let index = allElms.indexOf(elmData)
        allElms[index].pos = newPath
        allElms[index].live = false
    }

}

// Init
createBoard()


// Actions

$('body').on('click', '.canaccess.active', async function () {
    let elmName = atob($(this).attr("dataElmName"))
    let elmColor = atob($(this).attr("dataElmC"))

    showMovementPaths(elmName, elmColor)
    $('.canaccess.active').removeClass('clicked')
    $(this).addClass('clicked')
});


// Kill or Move on hint pos
$('body').on('click', '.hint_b', async function () {
    let hintElemPath = $(this).attr("path").split(",")
    hintElemPath[0] = parseInt(hintElemPath[0])
    hintElemPath[1] = parseInt(hintElemPath[1])
    // console.log(hintElemPath)

    let results = await allElms.filter(async obj => {
        if (obj.pos[0] == hintElemPath[0] && obj.pos[1] == hintElemPath[1]) {
            let index = allElms.indexOf(obj)
            obj.index = index
            console.log('Path Obj', obj)
            let winner = "black"
            if(obj.color == "black"){
                winner = "white"
            }
            if(obj.elmName == "king"){
                setTimeout(()=>{
                    alert(`Checkmate. ${winner} win this round. \nClick ok to restart`)
                    resetBoard()
                }, 1000)
                
                
            }
            await updateElmDym(obj, hintElemPath, 'die')


        }
    });
    await updateElmDym(currentSelectedElm, hintElemPath, 'move')
});




$('body').on('click', '.resetBoard', async function () {
    resetBoard()
});
$('body').on('click', '.loadLastGame', async function () {
    loadLastGame()
});
$('body').on('click', '.saveLastPos', async function () {
    saveToLocal()
});
