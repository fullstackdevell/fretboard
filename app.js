const root = document.documentElement;

const fretboard = document.querySelector('.fretboard');

const instrumentSelector =
    document.querySelector('#instrument-selector');

const accidentalSelector =
    document.querySelector('.accidental-selector');

const numberOfFretsSelector =
    document.querySelector('#number-of-frets');

const showAllNotesSelector =
    document.querySelector('#show-all-notes');

const showMultipleNotesSelector =
    document.querySelector('#show-multiple-notes');

const noteNameSection =
    document.querySelector('.note-name-section');


/* --------------------------------
   Application state
-------------------------------- */

let allNotes;

let showMultipleNotes = false;

let numberOfFrets =
    Number(numberOfFretsSelector.value);


/* --------------------------------
   Fret markers
-------------------------------- */

const singleFretMarkPositions = [
    3, 5, 7, 9, 15, 19, 21
];

const doubleFretMarkPositions = [
    12, 24
];


/* --------------------------------
   Note names
-------------------------------- */

const noteFlat = [
    "A",
    "Bb",
    "B",
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab"
];

const noteSharp = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#"
];


/*
   Get the currently checked
   Sharps / Flats option.
*/
let accidentals =
    document.querySelector(
        '.acc-select:checked'
    ).value;


/* --------------------------------
   Instrument tunings

   Numbers represent semitones
   relative to A.
-------------------------------- */

const instrumentTuningPresets = {

    "Guitar": [
        7, 2, 10, 5, 0, 7
    ],

    "Bass (4 strings)": [
        10, 5, 0, 7
    ],

    "Bass (5 strings)": [
        10, 5, 0, 7, 2
    ],

    "Ukulele": [
        0, 7, 3, 10
    ]

};


let selectedInstrument = "Guitar";

let numberOfStrings =
    instrumentTuningPresets[selectedInstrument].length;


/* --------------------------------
   Note colors
-------------------------------- */

const noteColors = {

    "A": "#f37226",
    "B": "#fa0703",
    "C": "#9322f7",
    "D": "#1024f6",
    "E": "#793b15",
    "F": "#27b0c2",
    "G": "#8cc831",

    "Db": "#000000",
    "Eb": "#000000",
    "Gb": "#000000",
    "Ab": "#000000",
    "Bb": "#000000",

    "C#": "#000000",
    "D#": "#000000",
    "F#": "#000000",
    "G#": "#000000",
    "A#": "#000000"

};


/* --------------------------------
   App
-------------------------------- */

const app = {


    /* ==============================
       INITIALIZATION
    ============================== */

    init() {

        this.setupInstrumentSelector();

        this.setupFretboard();

        this.setupNoteNameSection();

        this.setupEventListeners();

    },


    /* ==============================
       CREATE INSTRUMENT OPTIONS
    ============================== */

    setupInstrumentSelector() {

        instrumentSelector.innerHTML = "";

        for (
            const instrument in instrumentTuningPresets
        ) {

            const option =
                document.createElement("option");

            option.value = instrument;

            option.textContent = instrument;

            if (instrument === selectedInstrument) {
                option.selected = true;
            }

            instrumentSelector.appendChild(option);
        }

    },


    /* ==============================
       CREATE FRETBOARD
    ============================== */

    setupFretboard() {

        fretboard.innerHTML = "";

        root.style.setProperty(
            "--number-of-strings",
            numberOfStrings
        );


        /*
           Create each string.
        */

        for (
            let stringIndex = 0;
            stringIndex < numberOfStrings;
            stringIndex++
        ) {

            const string =
                document.createElement("div");

            string.classList.add("string");

            fretboard.appendChild(string);


            /*
               Create frets.

               +1 because fret 0 is
               the open string.
            */

            for (
                let fret = 0;
                fret <= numberOfFrets;
                fret++
            ) {

                const noteFret =
                    document.createElement("div");

                noteFret.classList.add("note-fret");

                string.appendChild(noteFret);


                /*
                   Calculate the note.
                */

                const noteIndex =
                    fret +
                    instrumentTuningPresets[
                        selectedInstrument
                    ][stringIndex];


                const noteName =
                    this.generateNoteName(
                        noteIndex
                    );


                /*
                   Store note name in HTML.
                */

                noteFret.dataset.note =
                    noteName;


                /*
                   Set note color.
                */

                noteFret.style.setProperty(
                    "--note-color",
                    noteColors[noteName]
                );


                /*
                   Fret markers.
                */

                if (
                    stringIndex === 0 &&
                    singleFretMarkPositions.includes(fret)
                ) {

                    noteFret.classList.add(
                        "fretmark"
                    );

                }


                /*
                   Double fret markers.
                */

                if (
                    stringIndex === 0 &&
                    doubleFretMarkPositions.includes(fret)
                ) {

                    const doubleFretMark =
                        document.createElement("div");

                    doubleFretMark.classList.add(
                        "double-fretmark"
                    );

                    noteFret.appendChild(
                        doubleFretMark
                    );

                }

            }

        }


        /*
           Save all notes so we can
           highlight them later.
        */

        allNotes =
            document.querySelectorAll(
                ".note-fret"
            );

    },


    /* ==============================
       GENERATE NOTE NAME
    ============================== */

    generateNoteName(noteIndex) {

        /*
           % 12 gives us one of the
           twelve chromatic notes.
        */

        noteIndex =
            noteIndex % 12;


        if (accidentals === "flats") {

            return noteFlat[noteIndex];

        }


        return noteSharp[noteIndex];

    },


    /* ==============================
       NOTE NAME SECTION
    ============================== */

    setupNoteNameSection() {

        noteNameSection.innerHTML = "";


        const noteNames =
            accidentals === "flats"
                ? noteFlat
                : noteSharp;


        noteNames.forEach(
            (noteName) => {

                const noteElement =
                    document.createElement("span");

                noteElement.textContent =
                    noteName;

                noteNameSection.appendChild(
                    noteElement
                );

            }
        );

    },


    /* ==============================
       MOUSE OVER FRET
    ============================== */

    showNoteDot(event) {

        if (
            !event.target.classList.contains(
                "note-fret"
            )
        ) {
            return;
        }


        const noteName =
            event.target.dataset.note;


        if (showMultipleNotes) {

            app.toggleMultipleNotes(
                noteName,
                1
            );

        } else {

            event.target.style.setProperty(
                "--noteDotOpacity",
                1
            );

        }

    },


    /* ==============================
       MOUSE OUT FRET
    ============================== */

    hideNoteDot(event) {

        if (
            !event.target.classList.contains(
                "note-fret"
            )
        ) {
            return;
        }


        const noteName =
            event.target.dataset.note;


        if (showMultipleNotes) {

            app.toggleMultipleNotes(
                noteName,
                0
            );

        } else {

            event.target.style.setProperty(
                "--noteDotOpacity",
                0
            );

        }

    },


    /* ==============================
       EVENT LISTENERS
    ============================== */

    setupEventListeners() {


        /*
           Fretboard hover.
        */

        fretboard.addEventListener(
            "mouseover",
            this.showNoteDot
        );

        fretboard.addEventListener(
            "mouseout",
            this.hideNoteDot
        );


        /*
           Instrument selector.
        */

        instrumentSelector.addEventListener(
            "change",
            (event) => {

                selectedInstrument =
                    event.target.value;

                numberOfStrings =
                    instrumentTuningPresets[
                        selectedInstrument
                    ].length;

                this.setupFretboard();

            }
        );


        /*
           Sharps / Flats.
        */

        accidentalSelector.addEventListener(
            "change",
            (event) => {

                if (
                    event.target.classList.contains(
                        "acc-select"
                    )
                ) {

                    /*
                       THIS is what changes
                       sharps <-> flats.
                    */

                    accidentals =
                        event.target.value;


                    /*
                       Rebuild the fretboard
                       using the new names.
                    */

                    this.setupFretboard();

                    this.setupNoteNameSection();

                }

            }
        );


        /*
           Number of frets.
        */

        numberOfFretsSelector.addEventListener(
            "change",
            (event) => {

                numberOfFrets =
                    Number(event.target.value);

                this.setupFretboard();

            }
        );


        /*
           Show all notes.
        */

        showAllNotesSelector.addEventListener(
            "change",
            () => {

                if (
                    showAllNotesSelector.checked
                ) {

                    root.style.setProperty(
                        "--noteDotOpacity",
                        1
                    );


                    fretboard.removeEventListener(
                        "mouseover",
                        this.showNoteDot
                    );

                    fretboard.removeEventListener(
                        "mouseout",
                        this.hideNoteDot
                    );

                } else {

                    root.style.setProperty(
                        "--noteDotOpacity",
                        0
                    );


                    fretboard.addEventListener(
                        "mouseover",
                        this.showNoteDot
                    );

                    fretboard.addEventListener(
                        "mouseout",
                        this.hideNoteDot
                    );

                }

                this.setupFretboard();

            }
        );


        /*
           Show multiple notes.
        */

        showMultipleNotesSelector.addEventListener(
            "change",
            () => {

                showMultipleNotes =
                    showMultipleNotesSelector.checked;

            }
        );


        /*
           Hover note names.
        */

        noteNameSection.addEventListener(
            "mouseover",
            (event) => {

                if (
                    event.target.tagName !== "SPAN"
                ) {
                    return;
                }


                const noteName =
                    event.target.textContent;


                this.toggleMultipleNotes(
                    noteName,
                    1
                );

            }
        );


        noteNameSection.addEventListener(
            "mouseout",
            (event) => {

                if (
                    event.target.tagName !== "SPAN"
                ) {
                    return;
                }


                /*
                   Don't hide notes when
                   "Show all notes" is active.
                */

                if (
                    showAllNotesSelector.checked
                ) {
                    return;
                }


                const noteName =
                    event.target.textContent;


                this.toggleMultipleNotes(
                    noteName,
                    0
                );

            }
        );

    },


    /* ==============================
       SHOW/HIDE ALL SAME NOTES
    ============================== */

    toggleMultipleNotes(
        noteName,
        opacity
    ) {

        allNotes.forEach(
            (note) => {

                if (
                    note.dataset.note === noteName
                ) {

                    note.style.setProperty(
                        "--noteDotOpacity",
                        opacity
                    );

                }

            }
        );

    }

};


/* --------------------------------
   Start application
-------------------------------- */

app.init();
