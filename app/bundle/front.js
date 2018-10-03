const el=e=>document.createElement(e),err=e=>{throw e},Task=class{constructor(e,t=!1){this.title=e,this.isComplete=t}setTitle(e){this.title=e}toggle(){this.isComplete=!this.isComplete}getInfo(){return{title:this.title,isComplete:this.isComplete}}},Folder=class{constructor(e){this.title=e,this.tasks=new Set}addTask(e){e instanceof Task||err("invalidTask"),this.tasks.add(e)}removeTask(e){e instanceof Task||err("invalidTask"),this.tasks.delete(e)}getTasks(){return[...this.tasks.values()]}getTitle(){return this.title}},App=class{constructor(){this.folders=new Set}addFolder(e){e instanceof Folder||err("invalidFolder"),this.folders.add(e)}removeFolder(e){e instanceof Folder||err("invalidFolder"),this.folders.delete(e)}getFolders(){return[...this.folders.values()]}},Renderer=class{constructor(e){this.app=e}render(){this._render()}_render(){throw"render 메소드를 구현해주세요."}},DOMRenderer=class extends Renderer{constructor(e,t){super(t),this.el=e.appendChild(el("section")),this.el.innerHTML='\n              <nav>\n                <input type="text">\n                <ul></ul>\n              </nav>\n              <section>\n                <header>\n                    <h2></h2>\n                </header>\n                <input type="text">\n                <ul></ul>\n              </section>\n              ',this.el.querySelector("nav").style.cssText="float:left;width:200px;border-right:1px solid #000",this.el.querySelector("section").style.cssText="margin-left:210px;";const r=this.el.querySelectorAll("ul");this.folder=r[0],this.task=r[1],this.currentFolder=null;const s=this.el.querySelectorAll("input");s[0].addEventListener("keyup",e=>{if(13!==e.keyCode)return;const t=e.target.value.trim();if(!t)return;const r=new Folder(t);this.app.addFolder(r),e.target.value="",this.render()}),s[1].addEventListener("keyup",e=>{if(13!==e.keyCode||!this.currentFolder)return;const t=e.target.value.trim();if(!t)return;new Folder(t);const r=new Task(t);this.currentFolder.addTask(r),e.target.value="",this.render()})}_render(){const e=this.app.getFolders();this.currentFolder||(this.currentFolder=e[0]),this.folder.innerHTML="",e.forEach(e=>{const t=el("li");t.innerHTML=e.getTitle(),t.style.cssText="font-size:"+(this.currentFolder==e?"25px":"15px"),t.addEventListener("click",()=>{this.currentFolder=e,this.render()}),this.folder.appendChild(t)}),this.currentFolder&&(this.task.innerHTML="",this.currentFolder.getTasks().forEach(e=>{const t=el("li"),{title:r,isComplete:s}=e.getInfo();t.innerHTML=(s?"completed ":"process ")+r,t.addEventListener("click",()=>{e.toggle(),this.render()}),this.task.appendChild(t)}))}},todo=new DOMRenderer(document.body,new App);