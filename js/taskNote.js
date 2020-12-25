'use strict'

let notes = new Set();

const noteApp = document.querySelector('.noteApp'),
    btnNewNote = document.querySelector('.newNote');

btnNewNote.addEventListener('click', () => {
    notes.add(new Note(noteApp));
    createHtml();
});



function createHtml () {
    noteApp.innerHTML = '';
    if (localStorage.length) {
        localStorage.clear();
    }

    [...notes].forEach((note, index) => {
        note.createNewNote(notes, createHtml);
        localStorage.setItem(index, JSON.stringify({text: note.text, posX: note.posX, posY: note.posY}));
    });
};

class Note {
    constructor (noteApp, args = {}) {
        let {text, posX, posY} = Object.keys(args).length ? args : {
            text : 'New text is here',
            posX : '30px',
            posY : '30px',
        };

        this.noteApp = noteApp;
        this.text = text;
        this.posX = posX;
        this.posY = posY;
    }

    //создаем блок разметки заметки
    createNewNote (notes, createHtml) {
        const divEl = document.createElement('div');
        divEl.classList.add('note');
        divEl.style.left = this.posX;
        divEl.style.top = this.posY;
        divEl.style.zIndex = 100;
        divEl.style.transform = `rotate(${0 - ([...notes].indexOf(this) + 10)}deg)`;
        divEl.addEventListener('dblclick', () => {
            divElem.style.display = 'none';
            textarea.style.display = 'block';
            divEl.style.transform = '';
            textarea.focus();
        });
        
        const divElem = document.createElement('div');
        divElem.classList.add('noteHead');
        divElem.textContent = this.text;
        
        const textarea = document.createElement('textarea');
        if (this.text !== 'New text is here') {
            textarea.value = this.text;
        }
        textarea.maxLength = '200';
        
        textarea.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && event.shiftKey === false) {
                event.preventDefault(); 
                divElem.style.display = 'block';
                textarea.style.display = 'none';
                this.text = textarea.value ? textarea.value : this.text;
                divEl.style.transform = `rotate(${0 - ([...notes].indexOf(this) + 10)}deg)`;
                createHtml();
            }
        });
        
        textarea.addEventListener('focusout', () => {
            divElem.style.display = 'block';
            textarea.style.display = 'none';
            this.text = textarea.value ? textarea.value : this.text;
            divEl.style.transform = `rotate(${0 - ([...notes].indexOf(this) + 10)}deg)`;
            createHtml();
        });
        
        const btnDel = document.createElement('input');
        btnDel.type = 'button';
        btnDel.value = 'X';
        btnDel.classList.add('btnDel');
        
        divEl.prepend(divElem);
        divEl.append(textarea);
        divEl.append(btnDel);
        this.noteApp.prepend(divEl);        
        
        btnDel.addEventListener('click', () => {
            notes.delete(this);
            createHtml();
        });
        
        //shiftX and shiftY координата нажатия на элемент до верхнего левого угла 
        divEl.addEventListener('mousedown', (event) => {
            // this.coords = getCoords(divEl);
            this.shiftX = event.pageX - divEl.offsetLeft;
            this.shiftY = event.pageY - divEl.offsetTop;
            this.divElHeight = divEl.offsetHeight;
            this.divElWidth = divEl.offsetWidth;
            window.addEventListener('mousemove', this);
        });

        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', this);
        });
    };
    
    //pageX and pageY место где находится наша мышка
    moveAt(event) {
        let pX = event.pageX;
        let pY = event.pageY;
        if (pX - this.shiftX < 0) {
            this.posX = 0;
            if (pY - this.shiftY < 0) {
                this.posY = 0;
                    
            } else if ((pY - this.shiftY + this.divElHeight) > this.noteApp.offsetHeight) {
                this.posY = `${this.noteApp.offsetHeight - this.divElHeight}px`;
                    
            } else {
                this.posY = `${pY - this.shiftY}px`;
            }
                    
        } else if (pY - this.shiftY < 0) {
            this.posY = 0;
                    
            if (pX - this.shiftX < 0) {
                this.posX = 0;
                        
            } else if ((pX - this.shiftX + this.divElWidth) > this.noteApp.offsetWidth) {
                this.posX = `${this.noteApp.offsetWidth - this.divElWidth}px`;
                        
            } else {
                this.posX = `${pX - this.shiftX}px`;
            }
                    
        } else if ((pX - this.shiftX + this.divElWidth) > this.noteApp.offsetWidth) {
            this.posX = `${this.noteApp.offsetWidth - this.divElWidth}px`;
                    
            if ((pY - this.shiftY + this.divElHeight) > this.noteApp.offsetHeight) {
                this.posY = `${this.noteApp.offsetHeight - this.divElHeight}px`;
                        
            } else {
                this.posY = `${pY - this.shiftY}px`;
            }
                    
        } else if ((pY - this.shiftY + this.divElHeight) > this.noteApp.offsetHeight) {
            this.posY = `${this.noteApp.offsetHeight - this.divElHeight}px`;
            this.posX = `${pX - this.shiftX}px`;
        } else {
            this.posX = `${pX - this.shiftX}px`;
            this.posY = `${pY - this.shiftY}px`;
        }
        createHtml();
    };

    handleEvent(event) {
        this.moveAt(event)
    }  
};  

if (localStorage.length) {
    for (let i =0; i < localStorage.length; i++) {
        let args = JSON.parse(localStorage.getItem(`${i}`));
        let divEl = new Note(noteApp,args);
        notes.add(divEl);
    }
    localStorage.clear();
    createHtml();
};
