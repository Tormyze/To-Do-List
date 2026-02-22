const notes = []
const screen = document.getElementById("screen")
const add = document.getElementById("add")
const addbox = document.getElementById("addbox")
const taskList = document.getElementById("taskList")

add.addEventListener("click", () => {
    screen.style.display = "block"
    add.style.display = 'none'
    addbox.classList.add("open")
});

taskList.addEventListener("click", (e) => {
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
});

const t = document.getElementById('title')
const d = document.getElementById('desc')

function resetScreen(){
    addbox.classList.remove('open')
    add.style.display = 'block'
    if (t) t.value = ''
    if (d) d.value = ''

    if (document.querySelector(".alert")){
        document.querySelector(".alert").remove()
    }
}

addbox.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        if (e.shiftKey) {} else {
            e.preventDefault()
            save()
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
        let li = document.createElement("li")
        li.classList.add('note')
        
        let h3 = document.createElement("h3")
        h3.classList.add('ntitle')
        h3.innerText = t.value
        
        let p = document.createElement("p")
        p.classList.add('ndesc')
        p.innerText = d.value.trim()

        let btnDel = document.createElement("button")
        btnDel.innerText = "X"
        btnDel.classList.add("btnDel")

        li.appendChild(h3)
        li.appendChild(p)
        li.appendChild(btnDel)

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


function back(){resetScreen()}