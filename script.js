const notes = []
const screen = document.getElementById("screen")
const add = document.getElementById("add")
const addbox = document.getElementById("addbox")
const taskList = document.getElementById("taskList")
let editingId = null

const t = document.getElementById('title')
const d = document.getElementById('desc')

document.addEventListener("keydown", (e) => {
    if (!addbox.classList.contains("open") && e.key === "Enter") {
        e.preventDefault()
        add.click() // simula click no botão
    }
})

add.addEventListener('click', () => {
    add.style.display = 'none'
    addbox.classList.add("open")
    
    t.focus()
})

taskList.addEventListener("click", (e) => {
    const editBtn = e.target.closest('.btnEdit')
    if (editBtn) {
        const li = editBtn.closest('li.note')
        if (!li) return
        const id = Number(li.dataset.id)
        const index = notes.findIndex(n => n.id === id)
        if (index !== -1) {
            t.value = notes[index].title
            d.value = notes[index].desc
            
            add.style.display = 'none'
            addbox.classList.add("open")
            t.focus()
            
            // status de nota sendo editada
            editingId = id
        }
        return
    }

    const deleteBtn = e.target.closest('.btnDel') // o botão
    if (deleteBtn) {
        const li = deleteBtn.closest('li.note') // a nota
        if (!li) return // click fora da nota
        const id = Number(li.dataset.id)
        const index = notes.findIndex(n => n.id === id)
        if (index !== -1) notes.splice(index, 1)
        // retorna -1 se não achar
    
        li.remove()
        return
    }

    const li = e.target.closest('li.note')
    if (!li) return // click fora da nota
    li.classList.toggle('done')
})

function resetScreen(){
    screen.style.display = 'block'
    addbox.classList.remove('open')
    add.style.display = 'block'
    if (t) t.value = ''
    if (d) d.value = ''

    editingId = null

    if (document.querySelector(".alert")){
        document.querySelector(".alert").remove()
    }
}

addbox.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        if (e.shiftKey) {} else {
            e.preventDefault()

            e.stopPropagation()
            // interrompe todas as ativações do Enter
            // Event Bubbling

            save()
        }
    } else if (e.key === "Escape"){
        back()
    } else if (e.key === "Tab"){
        e.preventDefault()

        if (document.activeElement === t) {
            d.focus()
        } else if (document.activeElement === d) {
            t.focus()
        }
    }
})

function save(){
    if(t.value == "" || d.value == ""){
        if (document.querySelector(".alert")) return

        let alert = document.createElement("p")
        alert.textContent = "Must add something!"
        alert.classList.add("alert")
        
        screen.appendChild(alert)
    } else {
        if (editingId !== null) {
            const index = notes.findIndex(n => n.id === editingId)
            if (index !== -1) {
                notes[index].title = t.value
                notes[index].desc = d.value
            }

            const li = document.querySelector(`li[data-id="${editingId}"]`)
            if (li) {
                li.querySelector('.ntitle').innerText = t.value
                li.querySelector('.ndesc').innerText = d.value.trim()
            }

            t.value = ''
            d.value = ''

            add.style.display = 'block'
            addbox.classList.toggle("open")

            editingId = null
        } else {
            let li = document.createElement("li")
            li.classList.add('note')
            
            let h3 = document.createElement("h3")
            h3.classList.add('ntitle')
            h3.innerText = t.value
            
            let p = document.createElement("p")
            p.classList.add('ndesc')
            p.innerText = d.value.trim()

            let noteBtns = document.createElement("div")
            noteBtns.classList.add("noteBtns")

            let btnEdit = document.createElement("button")
            btnEdit.innerText = "E"
            btnEdit.classList.add("btnEdit")

            let btnDel = document.createElement("button")
            btnDel.innerText = "X"
            btnDel.classList.add("btnDel")

            li.appendChild(h3)
            li.appendChild(p)
            li.appendChild(noteBtns)
            noteBtns.appendChild(btnEdit)
            noteBtns.appendChild(btnDel)

            const id = Date.now() // cria um ID único
            li.dataset.id = id // carimba ele na nota

            taskList.appendChild(li)

            class Note { // objeto da nota
                constructor(id, title, desc){
                    this.id = id
                    this.title = title
                    this.desc = desc
                }
            }

            notes.push(new Note(id, t.value, d.value))
            console.log(notes)
            resetScreen()
        }
    }
}

function back(){resetScreen()}