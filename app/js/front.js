const el = tag => document.createElement(tag);
const err = v => {throw v;};

const Task = class{
  constructor(title, isComplete = false){
    this.title = title;
    this.isComplete = isComplete;
  }
  setTitle(title){this.title = title;}
  toggle(){this.isComplete = !this.isComplete;}
  getInfo(){return {title:this.title, isComplete:this.isComplete};}
};

const Folder =
  class{
    constructor(title){
      this.title = title;
      this.tasks = new Set();
    }
    addTask(task){
      if(!(task instanceof Task)) err('invalidTask');
      this.tasks.add(task);
    }
    removeTask(task){
      if(!(task instanceof Task)) err('invalidTask');
      this.tasks.delete(task);
    }
    getTasks(){return [...this.tasks.values()];}
    getTitle(){return this.title;}
  };

const App =
  class{
    constructor(){
      this.folders = new Set();
    }
    addFolder(folder){
      if(!(folder instanceof Folder)) err('invalidFolder');
      this.folders.add(folder);
    }
    removeFolder(folder){
      if(!(folder instanceof Folder)) err('invalidFolder');
      this.folders.delete(folder);
    }
    getFolders(){return [...this.folders.values()];}
  };

const Renderer = class{
  constructor(app){this.app = app;}
  render(){this._render();}
  _render(){throw "render 메소드를 구현해주세요.";}
};


const DOMRenderer = class extends Renderer{
  constructor(parent, app){
    super(app);
    this.el = parent.appendChild(el('section'));
    this.el.innerHTML = `
              <nav>
                <input type="text">
                <ul></ul>
              </nav>
              <section>
                <header>
                    <h2></h2>
                </header>
                <input type="text">
                <ul></ul>
              </section>
              `

    this.el.querySelector('nav').style.cssText='float:left;width:200px;border-right:1px solid #000';
    this.el.querySelector('section').style.cssText='margin-left:210px;';

    const ul = this.el.querySelectorAll('ul');
    this.folder = ul[0];
    this.task = ul[1];
    this.currentFolder = null;

    const input = this.el.querySelectorAll('input');
    input[0].addEventListener("keyup", e =>{
      if(e.keyCode !== 13) return;
      const v = e.target.value.trim();
      if(!v) return;
      const folder = new Folder(v);
      this.app.addFolder(folder);
      e.target.value = '';
      this.render();
    });

    input[1].addEventListener("keyup", e =>{
      if(e.keyCode !== 13 || !this.currentFolder) return;
      const v = e.target.value.trim();
      if(!v) return;
      const folder = new Folder(v);
      const task = new Task(v);
      this.currentFolder.addTask(task);
      e.target.value = '';
      this.render();
    });
  }

  _render(){
    const folders = this.app.getFolders();
    if(!this.currentFolder) this.currentFolder = folders[0];
    this.folder.innerHTML = '';
    folders.forEach(f=>{
      const li = el('li');
      li.innerHTML = f.getTitle();
      li.style.cssText='font-size:' + (this.currentFolder == f ? '25px' : '15px');
      li.addEventListener("click" , () => {
        this.currentFolder = f;
        this.render();
      });
      this.folder.appendChild(li);
    });

    if(!this.currentFolder) return;
    this.task.innerHTML = ''
    ;              this.currentFolder.getTasks().forEach(t => {
      const li = el('li');
      const {title, isComplete} = t.getInfo();
      li.innerHTML = (isComplete? "completed " : "process ") + title;
      li.addEventListener("click" , () => {
        t.toggle();
        this.render();
      });
      this.task.appendChild(li);
    });
  }
}
const todo = new DOMRenderer(document.body, new App());