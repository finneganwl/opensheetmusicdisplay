import { OpenSheetMusicDisplay } from '../src/OpenSheetMusicDisplay/OpenSheetMusicDisplay';

/*jslint browser:true */
(function () {
    "use strict";
    var openSheetMusicDisplay;
    var sampleFolder = process.env.STATIC_FILES_SUBFOLDER ? process.env.STATIC_FILES_SUBFOLDER + "/" : "",
    samples = {
        "Beethoven, L.v. - An die ferne Geliebte": "Beethoven_AnDieFerneGeliebte.xml",
        "Clementi, M. - Sonatina Op.36 No.1 Pt.1": "MuzioClementi_SonatinaOpus36No1_Part1.xml",
        "Clementi, M. - Sonatina Op.36 No.1 Pt.2": "MuzioClementi_SonatinaOpus36No1_Part2.xml",
        "Clementi, M. - Sonatina Op.36 No.3 Pt.1": "MuzioClementi_SonatinaOpus36No3_Part1.xml",
        "Clementi, M. - Sonatina Op.36 No.3 Pt.2": "MuzioClementi_SonatinaOpus36No3_Part2.xml",
        "Bach, J.S. - Praeludium in C-Dur BWV846 1": "JohannSebastianBach_PraeludiumInCDur_BWV846_1.xml",
        "Bach, J.S. - Air": "JohannSebastianBach_Air.xml",
        "Gounod, C. - Méditation": "CharlesGounod_Meditation.xml",
        "Haydn, J. - Concertante Cello": "JosephHaydn_ConcertanteCello.xml",
        "Joplin, S. - Elite Syncopations": "ScottJoplin_EliteSyncopations.xml",
        "Joplin, S. - The Entertainer": "ScottJoplin_The_Entertainer.xml",
        "Mozart, W.A. - An Chloe": "Mozart_AnChloe.xml",
        "Mozart, W.A. - Das Veilchen": "Mozart_DasVeilchen.xml",
        "Mozart, W.A. - Clarinet Quintet (Excerpt)": "Mozart_Clarinet_Quintet_Excerpt.mxl",
        "Mozart, W.A. - String Quartet in G, K. 387, 1st Mvmt Excerpt": "Mozart_String_Quartet_in_G_K._387_1st_Mvmnt_excerpt.musicxml",
        "Mozart/Holzer - Land der Berge (national anthem of Austria)": "Land_der_Berge.musicxml",
        "OSMD Function Test - All": "OSMD_function_test_all.xml",
        "OSMD Function Test - Accidentals": "OSMD_function_test_accidentals.musicxml",
        "OSMD Function Test - Autobeam": "OSMD_function_test_autobeam.musicxml",
        "OSMD Function Test - Auto-/Custom-Coloring": "OSMD_function_test_auto-custom-coloring-entchen.musicxml",
        "OSMD Function Test - Bar lines": "OSMD_function_test_bar_lines.musicxml",
        "OSMD Function Test - Color (from XML)": "OSMD_function_test_color.musicxml",
        "OSMD Function Test - Drumset": "OSMD_function_test_drumset.musicxml",
        "OSMD Function Test - Expressions": "OSMD_function_test_expressions.musicxml",
        "OSMD Function Test - Expressions Overlap": "OSMD_function_test_expressions_overlap.musicxml",
        "OSMD Function Test - Grace Notes": "OSMD_function_test_GraceNotes.xml",
        "OSMD Function Test - Invisible Notes": "OSMD_function_test_invisible_notes.musicxml",
        "OSMD Function Test - Selecting Measures To Draw": "OSMD_function_test_measuresToDraw_Beethoven_AnDieFerneGeliebte.xml",
        "OSMD Function Test - Notehead Shapes": "OSMD_function_test_noteheadShapes.musicxml",
        "OSMD Function Test - Ornaments": "OSMD_function_test_Ornaments.xml",
        "OSMD Function Test - Tremolo": "OSMD_Function_Test_Tremolo_2bars.musicxml",
        "Schubert, F. - An Die Musik": "Schubert_An_die_Musik.xml",
        "Actor, L. - Prelude (Large Sample, loading time)": "ActorPreludeSample.xml",
        "Anonymous - Saltarello": "Saltarello.mxl",
        "Debussy, C. - Mandoline": "Debussy_Mandoline.xml",
        "Levasseur, F. - Parlez Mois": "Parlez-moi.mxl",
        "Schumann, R. - Dichterliebe": "Dichterliebe01.xml",
        "Telemann, G.P. - Sonate-Nr.1.1-Dolce": "TelemannWV40.102_Sonate-Nr.1.1-Dolce.xml",
        "Telemann, G.P. - Sonate-Nr.1.2-Allegro": "TelemannWV40.102_Sonate-Nr.1.2-Allegro-F-Dur.xml",
    },

    zoom = 1.0,
    // HTML Elements in the page
    err,
    error_tr,
    canvas,
    selectSample,
    selectBounding,
    skylineDebug,
    bottomlineDebug,
    zoomIn,
    zoomOut,
    zoomDiv,
    custom,
    nextCursorBtn,
    resetCursorBtn,
    followCursorCheckbox,
    showCursorBtn,
    hideCursorBtn,
    backendSelect,
    debugReRenderBtn,
    debugClearBtn;

    // Initialization code
    function init() {
        var name, option;

        err = document.getElementById("error-td");
        error_tr = document.getElementById("error-tr");
        zoomDiv = document.getElementById("zoom-str");
        custom = document.createElement("option");
        selectSample = document.getElementById("selectSample");
        selectBounding = document.getElementById("selectBounding");
        skylineDebug = document.getElementById("skylineDebug");
        bottomlineDebug = document.getElementById("bottomlineDebug");
        zoomIn = document.getElementById("zoom-in-btn");
        zoomOut = document.getElementById("zoom-out-btn");
        canvas = document.createElement("div");
        nextCursorBtn = document.getElementById("next-cursor-btn");
        resetCursorBtn = document.getElementById("reset-cursor-btn");
        followCursorCheckbox = document.getElementById("follow-cursor-checkbox");
        showCursorBtn = document.getElementById("show-cursor-btn");
        hideCursorBtn = document.getElementById("hide-cursor-btn");
        backendSelect = document.getElementById("backend-select");
        debugReRenderBtn = document.getElementById("debug-re-render-btn");
        debugClearBtn = document.getElementById("debug-clear-btn");

        // Hide error
        error();

        // Create select
        for (name in samples) {
            if (samples.hasOwnProperty(name)) {
                option = document.createElement("option");
                option.value = samples[name];
                option.textContent = name;
            }
            selectSample.appendChild(option);
        }
        selectSample.onchange = selectSampleOnChange;
        if (selectBounding) {
            selectBounding.onchange = selectBoundingOnChange;
        }

        // Pre-select default music piece

        custom.appendChild(document.createTextNode("Custom"));

        // Create zoom controls
        zoomIn.onclick = function () {
            zoom *= 1.2;
            scale();
        };
        zoomOut.onclick = function () {
            zoom /= 1.2;
            scale();
        };

        if (skylineDebug) {
            skylineDebug.onclick = function() {
                openSheetMusicDisplay.DrawSkyLine = !openSheetMusicDisplay.DrawSkyLine;
            }
        }

        if (bottomlineDebug) {
            bottomlineDebug.onclick = function() {
                openSheetMusicDisplay.DrawBottomLine = !openSheetMusicDisplay.DrawBottomLine;
            }
        }

        if (debugReRenderBtn) {
            debugReRenderBtn.onclick = function() {
                rerender();
            }
        }

        if (debugClearBtn) {
            debugClearBtn.onclick = function() {
                openSheetMusicDisplay.clear();
            }
        }

        // Create OSMD object and canvas
        openSheetMusicDisplay = new OpenSheetMusicDisplay(canvas, {
            autoResize: true,
            backend: backendSelect.value,
            disableCursor: false,
            drawingParameters: "default", // try compact (instead of default)
            drawPartNames: true, // try false
            // drawTitle: false,
            // drawSubtitle: false,
            //drawFromMeasureNumber: 4,
            //drawUpToMeasureNumber: 8,
            drawFingerings: true,
            fingeringPosition: "auto", // left is default. try right. experimental: auto, above, below.
            // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
            setWantedStemDirectionByXml: true, // try false, which was previously the default behavior
            // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.

            // coloring options
            coloringEnabled: true,
            // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
            // defaultColorStem: "#BB0099",

            autoBeam: false, // try true, OSMD Function Test AutoBeam sample
            autoBeamOptions: {
                beam_rests: false,
                beam_middle_rests_only: false,
                //groups: [[3,4], [1,1]],
                maintain_stem_directions: false
            },

            // tupletsBracketed: true, // creates brackets for all tuplets except triplets, even when not set by xml
            // tripletsBracketed: true,
            // tupletsRatioed: true, // unconventional; renders ratios for tuplets (3:2 instead of 3 for triplets)
        });
        openSheetMusicDisplay.setLogLevel('info');
        document.body.appendChild(canvas);

        window.addEventListener("keydown", function(e) {
            var event = window.event ? window.event : e;
            if (event.keyCode === 39) {
                openSheetMusicDisplay.cursor.next();
            }
        });
        nextCursorBtn.addEventListener("click", function() {
            openSheetMusicDisplay.cursor.next();
        });
        resetCursorBtn.addEventListener("click", function() {
            openSheetMusicDisplay.cursor.reset();
        });
        if (followCursorCheckbox) {
            followCursorCheckbox.onclick = function() {
                openSheetMusicDisplay.FollowCursor = !openSheetMusicDisplay.FollowCursor;
            }
        }
        hideCursorBtn.addEventListener("click", function() {
            openSheetMusicDisplay.cursor.hide();
        });
        showCursorBtn.addEventListener("click", function() {
            if (openSheetMusicDisplay.cursor) {
                openSheetMusicDisplay.cursor.show();
            } else {
                console.info("Can't show cursor, as it was disabled (e.g. by drawingParameters).");
            }
        });

        backendSelect.addEventListener("change", function(e) {
            var value = e.target.value;
            var createNewOsmd = true;

            if (createNewOsmd) {
                // clears the canvas element
                canvas.innerHTML = "";
                openSheetMusicDisplay = new OpenSheetMusicDisplay(canvas, {backend: value});
                openSheetMusicDisplay.setLogLevel('info');
            } else {
                // alternative, doesn't work yet, see setOptions():
                openSheetMusicDisplay.setOptions({backend: value});
            }

            selectSampleOnChange();

        });
    }

    function selectBoundingOnChange(evt) {
        var value = evt.target.value;
        openSheetMusicDisplay.DrawBoundingBox = value;
    }

    function selectSampleOnChange(str) {
        error();
        disable();
        var isCustom = typeof str === "string";
        if (!isCustom) {
            str = sampleFolder + selectSample.value;
        }
        zoom = 1.0;

        if (str.includes("measuresToDraw")) {
            // for debugging: draw from a random range of measures
            let minMeasureToDraw = Math.ceil(Math.random() * 15); // measures start at 1 (measureIndex = measure number - 1 elsewhere)
            let maxMeasureToDraw = Math.ceil(Math.random() * 15);
            if (minMeasureToDraw > maxMeasureToDraw) {
                minMeasureToDraw = maxMeasureToDraw;
                let a = minMeasureToDraw;
                maxMeasureToDraw = a;
            }
            //minMeasureToDraw = 1; // set your custom indexes here. Drawing only one measure can be a special case
            //maxMeasureToDraw = 1;
            console.log("drawing measures in the range: [" + minMeasureToDraw + "," + maxMeasureToDraw + "]");
            openSheetMusicDisplay.setOptions({
                drawFromMeasureNumber: minMeasureToDraw,
                drawUpToMeasureNumber: maxMeasureToDraw
            });
        } else { // reset for other samples
            openSheetMusicDisplay.setOptions({
                drawFromMeasureNumber: 0,
                drawUpToMeasureNumber: Number.MAX_VALUE
            });
        }

        // Enable Boomwhacker-like coloring for OSMD Function Test - Auto-Coloring (Boomwhacker-like, custom color set)
        if (str.includes("auto-custom-coloring")) {
            //openSheetMusicDisplay.setOptions({coloringMode: 1}); // Auto-Coloring with pre-defined colors
            openSheetMusicDisplay.setOptions({
                coloringMode: 2, // custom coloring set. 0 would be XML, 1 autocoloring
                coloringSetCustom: ["#d82c6b", "#F89D15", "#FFE21A", "#4dbd5c", "#009D96", "#43469d", "#76429c", "#ff0000"],
                // last color value of coloringSetCustom is for rest notes

                colorStemsLikeNoteheads: true
            });
        } else {
            openSheetMusicDisplay.setOptions({coloringMode: 0, colorStemsLikeNoteheads: false});
        }
        openSheetMusicDisplay.setOptions({autoBeam: str.includes("autobeam")});
        openSheetMusicDisplay.setOptions({drawPartAbbreviations: !str.includes("Schubert_An_die_Musik")}); // TODO weird layout bug here. but shouldn't be in score anyways
        openSheetMusicDisplay.load(str).then(
            function() {
                // This gives you access to the osmd object in the console. Do not use in productive code
                window.osmd = openSheetMusicDisplay;
                return openSheetMusicDisplay.render();
            },
            function(e) {
                errorLoadingOrRenderingSheet(e, "rendering");
            }
        ).then(
            function() {
                return onLoadingEnd(isCustom);
            }, function(e) {
                errorLoadingOrRenderingSheet(e, "loading");
                onLoadingEnd(isCustom);
            }
        );
    }

    function errorLoadingOrRenderingSheet(e, loadingOrRenderingString) {
        var errorString = "Error " + loadingOrRenderingString + " sheet: " + e;
        // if (process.env.DEBUG) { // people may not set a debug environment variable for the demo.
        // Always giving a StackTrace might give us more and better error reports.
        // TODO for a release, StackTrace control could be reenabled
        errorString += "\n" + "StackTrace: \n" + e.stack;
        // }
        console.warn(errorString);
    }

    function onLoadingEnd(isCustom) {
        // Remove option from select
        if (!isCustom && custom.parentElement === selectSample) {
            selectSample.removeChild(custom);
        }
        // Enable controls again
        enable();
    }

    function logCanvasSize() {
        zoomDiv.innerHTML = Math.floor(zoom * 100.0) + "%";
    }

    function scale() {
        disable();
        window.setTimeout(function(){
            openSheetMusicDisplay.zoom = zoom;
            openSheetMusicDisplay.render();
            enable();
        }, 0);
    }

    function rerender() {
        disable();
        window.setTimeout(function(){
            if (openSheetMusicDisplay.IsReadyToRender()) {
                openSheetMusicDisplay.render();
            } else {
                selectSampleOnChange(); // reload sample e.g. after osmd.clear()
            }
            enable();
        }, 0);
    }

    function error(errString) {
        if (!errString) {
            error_tr.style.display = "none";
        } else {
            err.textContent = errString;
            error_tr.style.display = "";
            canvas.width = canvas.height = 0;
            enable();
        }
    }

    // Enable/Disable Controls
    function disable() {
        document.body.style.opacity = 0.3;
        selectSample.disabled = zoomIn.disabled = zoomOut.disabled = "disabled";
    }
    function enable() {
        document.body.style.opacity = 1;
        selectSample.disabled = zoomIn.disabled = zoomOut.disabled = "";
        logCanvasSize();
    }

    // Register events: load, drag&drop
    window.addEventListener("load", function() {
        init();
        selectSampleOnChange();
    });
    window.addEventListener("dragenter", function(event) {
        event.preventDefault();
        disable();
    });
    window.addEventListener("dragover", function(event) {
        event.preventDefault();
    });
    window.addEventListener("dragleave", function(event) {
        enable();
    });
    window.addEventListener("drop", function(event) {
        event.preventDefault();
        if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) {
            return;
        }
        // Add "Custom..." score
        selectSample.appendChild(custom);
        custom.selected = "selected";
        // Read dragged file
        var reader = new FileReader();
        reader.onload = function (res) {
            selectSampleOnChange(res.target.result);
        };
        var filename = event.dataTransfer.files[0].name;
        if (filename.toLowerCase().indexOf(".xml") > 0
            || filename.toLowerCase().indexOf(".musicxml") > 0) {
            reader.readAsText(event.dataTransfer.files[0]);
        } else if (event.dataTransfer.files[0].name.toLowerCase().indexOf(".mxl") > 0){
            reader.readAsBinaryString(event.dataTransfer.files[0]);
        }
        else {
            alert("No vaild .xml/.mxl/.musicxml file!");
        }
    });
}());
