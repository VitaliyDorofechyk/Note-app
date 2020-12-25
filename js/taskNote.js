'use strict'

const noteApp = document.querySelector('.noteApp');
const btnNewNote = document.querySelector('.newNote');
btnNewNote.addEventListener('click', createNote);
const notes = [];

class Note {
constructor (text = 'New text is here', posX = '30px', posY = '30px') {
    this.text = text;
    this.posX = posX;
    this.posY = posY;
    }
}

function createNote() {
    notes.push(new Note());
    createHtml();
};

function createHtml () {
    noteApp.innerHTML = '';
    notes.map(function(note, index) {
        createNewNote(note.text, note.posX, note.posY, index);
    });
};

//создаем блок разметки заметки
function createNewNote (text, posX, posY, index) {
    const divEl = document.createElement('div');
    divEl.classList.add('note');
    divEl.style.left = posX;
    divEl.style.top = posY;
    divEl.style.transform = `rotate(${0 - (index + 10)}deg)`;
    divEl.addEventListener('dblclick', () => {
        divElem.style.display = 'none';
        textarea.style.display = 'block';
        divEl.style.transform = '';
        textarea.focus();
    });
    
    const divElem = document.createElement('div');
    divElem.classList.add('noteHead');
    divElem.textContent = text;
    
    const textarea = document.createElement('textarea');
    if (text !== 'New text is here') {
        textarea.value = text;
    }
    textarea.maxLength = '200';
    
    textarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && event.shiftKey === false) {
            event.preventDefault(); 
            divElem.style.display = 'block';
            textarea.style.display = 'none';
            if (textarea.value) {
                notes[index].text = textarea.value;
            }
            divEl.style.transform = `rotate(${0 - (index + 10)}deg)`;
            createHtml();
        }
    });
    
    textarea.addEventListener('focusout', () => {
        divElem.style.display = 'block';
        textarea.style.display = 'none';
        if (textarea.value) {
            notes[index].text = textarea.value;
        }
        divEl.style.transform = `transform: rotate(${0 - (index + 10)}deg)`;
        createHtml();
    });
    
    const btnDel = document.createElement('input');
    btnDel.type = 'button';
    btnDel.value = 'X';
    btnDel.classList.add('btnDel');
    
    divEl.prepend(divElem);
    divEl.append(textarea);
    divEl.append(btnDel);
    noteApp.prepend(divEl);        
    
    btnDel.addEventListener('click', () => {
        notes.splice(index, 1);
        createHtml();
    });
    
    
    //shiftX and shiftY координата нажатия на элемент до верхнего левого угла 
    divEl.addEventListener('mousedown', downDivEl);
    function downDivEl (event) {
        let coords = getCoords(divEl);
        let shiftX = event.pageX - coords.left;
        let shiftY = event.pageY - coords.top;
        //pageYOffset на сколько прокручен элемент относит Y
        function getCoords(elem) {   // кроме IE8-
            let box = elem.getBoundingClientRect();
            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset,
            };
        };
        divEl.style.zIndex = 100;
        let divElWidth = divEl.offsetWidth;
        let divElHeight = divEl.offsetHeight;

        window.addEventListener('mousemove', moveAt);
        //pageX and pageY место где находится наша мышка
        function moveAt(event) {
        	let pX = event.pageX;
			let pY = event.pageY;
			if (pX - shiftX < 0) {
				notes[index].posX = 0;
				if (pY - shiftY < 0) {
					notes[index].posY = 0;
                    
				} else if ((pY - shiftY + divElHeight) > noteApp.offsetHeight) {
                  	notes[index].posY = `${noteApp.offsetHeight - divElHeight}px`;
                    
				} else {
                    notes[index].posY = `${pY - shiftY}px`;
                }
                
			} else if (pY - shiftY < 0) {
                notes[index].posY = 0;
                
				if (pX - shiftX < 0) {
                    notes[index].posX = 0;
                    
				} else if ((pX - shiftX + divElWidth) > noteApp.offsetWidth) {
                    notes[index].posX = `${noteApp.offsetWidth - divElWidth}px`;
                    
				} else {
                    notes[index].posX = `${pX - shiftX}px`;
                }
                
			} else if ((pX - shiftX + divElWidth) > noteApp.offsetWidth) {
                notes[index].posX = `${noteApp.offsetWidth - divElWidth}px`;
                
				if ((pY - shiftY + divElHeight) > noteApp.offsetHeight) {
                    notes[index].posY = `${noteApp.offsetHeight - divElHeight}px`;
                    
				} else {
                    notes[index].posY = `${pY - shiftY}px`;
                }
                
			} else if ((pY - shiftY + divElHeight) > noteApp.offsetHeight) {
                notes[index].posY = `${noteApp.offsetHeight - divElHeight}px`;
				notes[index].posX = `${pX - shiftX}px`;
			} else {
                notes[index].posX = `${pX - shiftX}px`;
				notes[index].posY = `${pY - shiftY}px`;
			}
        createHtml();
        };
        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', moveAt);
        }); 
        divEl.ondragstart = function () {
            return false;
        };
    };
};



