class ClassWatcher {
    constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
        this.targetNode = targetNode
        this.classToWatch = classToWatch
        this.classAddedCallback = classAddedCallback
        this.classRemovedCallback = classRemovedCallback
        this.observer = null
        this.lastClassState = targetNode.classList.contains(this.classToWatch)

        this.init()
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer.observe(this.targetNode, { attributes: true })
    }

    disconnect() {
        this.observer.disconnect()
    }

    mutationCallback = mutationsList => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClassState = mutation.target.classList.contains(this.classToWatch)
                if(this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState
                    if(currentClassState) {
                        this.classAddedCallback()
                    }
                    else {
                        this.classRemovedCallback()
                    }
                }
            }
        }
    }
}

function promptHistoryItemClick(id) {
    var textarea = gradioApp().querySelector('#prompt_history_item_id_text textarea');
    textarea.value = id;
    updateInput(textarea);

    gradioApp().querySelector('#prompt_history_click_item_btn').click();
}

function promptHistoryItemDelete(id) {
    var textarea = gradioApp().querySelector('#prompt_history_item_id_text textarea');
    textarea.value = id;
    updateInput(textarea);

    gradioApp().querySelector('#prompt_history_delete_item_btn').click();
}

function promptHistoryPrev() {
    gradioApp().querySelector('#prompt_history_prev_btn').click();
}

function promptHistoryNext() {
    gradioApp().querySelector('#prompt_history_next_btn').click();
}

function promptHistorySave() {
    gradioApp().querySelector('#prompt_history_save_btn').click();
}

function promptHistoryAutoRefresh() {
    // hijack ui
    const btn_c = gradioApp().querySelector('#txt2img_style_create')
    const pinit = gradioApp().querySelector('#txt2img_gallery_container');
    const pdiv = pinit.parentNode;
    if (pdiv !== undefined) {
        const btnSave = document.createElement("button");
        btnSave.id = "prompt_history_save_btn_txt2img"
        btnSave.onclick = function(){ return promptHistorySave();};
        btnSave.classList.add("lg", "secondary", "gradio-button", btn_c.classList[btn_c.classList.length-1])
        btnSave.innerHTML = "Save Last Generated Info"
        pdiv.insertBefore(btnSave, pinit);
        
        // watch btn
        const saveBtn = gradioApp().querySelector('#prompt_history_save_btn');
        let hideStateWatcher = new ClassWatcher(saveBtn, 'hide', 
        ()=> {
            btnSave.classList.add("hide")
        }, 
        ()=>{
            btnSave.classList.remove("hide")
        });
    }
    
    const ll = setInterval(() => {
        const generating = gradioApp().querySelector('#tab_extension_prompt_history_tab .generating');
        if (generating !== undefined && generating !== null) {
            generating.remove();
            clearInterval(ll);
            return;
        }
    }, 1000);
}

onUiLoaded(async() => {
    promptHistoryAutoRefresh()
});

