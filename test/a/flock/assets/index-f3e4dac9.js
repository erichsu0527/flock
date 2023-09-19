var Q=Object.defineProperty;var tt=(s,t,e)=>t in s?Q(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var d=(s,t,e)=>(tt(s,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const h of i.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&n(h)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();const et=(s,t,e,n)=>[s*e-t*n,s*n+t*e];function J(s){var t,e,n;e=s*.5,n=s;var i=new ArrayBuffer(4);return new Float32Array(i)[0]=s,t=new Uint32Array(i)[0],t=1597463007-(t>>1),new Uint32Array(i)[0]=t,n=new Float32Array(i)[0],n=n*(1.5-e*n*n),n}let l=[0,0],W=20,V=W**2,H=.003,P=80,S=.005,B=1e-4,L=.4,a=100,I=.02,z=!1,K=!1;const k=s=>{P=s},q=s=>{W=s,V=s**2},$=s=>{H=s},O=s=>{S=s},A=s=>{B=s},j=s=>{L=s},F=s=>{a=s},C=s=>{I=s},U=s=>{z=s},D=s=>{K=s},x=class x{constructor(t,e,n,r){d(this,"x");d(this,"y");d(this,"vx");d(this,"vy");d(this,"ax");d(this,"ay");this.x=t,this.y=e,this.vx=n,this.vy=r,this.ax=0,this.ay=0}*iter_vertices(){let t=[[10,0],[-5,-5],[0,0],[-5,5],[10,0]],e=J(this.vx*this.vx+this.vy*this.vy),[n,r]=[this.vx*e,this.vy*e];for(let i of t){let h=et(i[0]*x.scale,i[1]*x.scale,n,r);yield[this.x+h[0],this.y+h[1]]}}render(t){t.fillStyle=x.color,t.beginPath();let e=!0;for(let n of this.iter_vertices())e?(t.moveTo(n[0],n[1]),e=!1):t.lineTo(n[0],n[1]);t.closePath(),t.fill(),z&&(t.beginPath(),t.arc(this.x,this.y,P,0,2*Math.PI),t.stroke())}equals(t){return this.x===t.x&&this.y===t.y}};d(x,"scale",1),d(x,"color","white");let M=x;class G{constructor(t,e){this.x=t,this.y=e}toString(){return`Point(${this.x}, ${this.y})`}equals(t){return this.x===t.x&&this.y===t.y}}const m=class m{constructor(t,e,n,r=0,i=0,h=null){this.id=n,this.w=t,this.hw=t/2,this.h=e,this.x=r,this.y=i,this.parent=h,this.children=[],this.points=[]}has_children(){return this.children.length>0}insert(t){if(t.x<this.x||t.x>=this.x+this.w||t.y<this.y||t.y>=this.y+this.h)throw new Error("Point is out of range");if(this.has_children()){const e=+(t.x>=this.x+this.hw)+ +(t.y>=this.y+this.h/2)*2;this.children[e].insert(t)}else{if(this.points.some(e=>e.equals(t)))return;this.points.push(t),this.check_split()}}check_split(){if(this.points.length<=m.SPLIT_THRESHOLD)return;const t=this.hw,e=this.h/2;this.children=[new m(t,e,[...this.id,0],this.x,this.y,this),new m(this.w-t,e,[...this.id,1],this.x+t,this.y,this),new m(t,this.h-e,[...this.id,2],this.x,this.y+e,this),new m(this.w-t,this.h-e,[...this.id,3],this.x+t,this.y+e,this)];for(const n of this.points)this.insert(n);this.points=[]}get_containing_node(t){if(this.has_children()){const e=+(t.x>=this.x+this.hw)+ +(t.y>=this.y+this.h/2)*2;return this.children[e].get_containing_node(t)}else return this}do_contain_point(t){return t.x>=this.x&&t.x<this.x+this.w&&t.y>=this.y&&t.y<this.y+this.h}overlap(t){return!(this.x+this.w<t.x||t.x+t.w<this.x||this.y+this.h<t.y||t.y+t.h<this.y)}*search_range(t,e,n){let r=n*2;yield*this._search_range(new m(r,r,[],t-n,e-n),n*n)}*_search_range(t,e){if(this.overlap(t))if(this.has_children())for(const n of this.children)yield*n._search_range(t,e);else for(const n of this.points){let r=(t.x+t.hw-n.x)**2+(t.y+t.h/2-n.y)**2;r<=e&&(yield[n,r])}}draw_line(t,e){if(this.has_children()){for(const n of this.children)n.draw_line(t,e);t.strokeStyle=e,t.lineWidth=1,t.beginPath(),t.moveTo(this.x+this.hw,this.y),t.lineTo(this.x+this.hw,this.y+this.h),t.moveTo(this.x,this.y+this.h/2),t.lineTo(this.x+this.w,this.y+this.h/2),t.stroke()}}draw_points(t,e,n){for(const r of this.children)r.draw_points(t,e,n);t.fillStyle=e;for(const r of this.points)t.beginPath(),t.arc(r.x,r.y,n,0,2*Math.PI),t.fill()}find_closest(t,e){let n=new G(t,e),r=[1/0,null],i=this.get_containing_node(n),h=null;do i._find_closest_from_children(r,t,e,h),h=i,i=i.parent;while(i!==null);return r[1]}_can_contain_closer(t,e,n){let[r,i]=n;return t+r>this.x||t-r<this.x+this.w||e+r>this.y||e-r<this.y+this.h}_find_closest_from_children(t,e,n,r){if(this._can_contain_closer(e,n,t)){for(const i of this.children)i!==r&&i._find_closest_from_children(t,e,n,null);for(const i of this.points){const h=(i.x-e)**2+(i.y-n)**2;h<t[0]&&(t[0]=h,t[1]=i)}}}remove(t){let e=this.get_containing_node(new G(t.x,t.y));e.points=e.points.filter(n=>n.x!==t.x&&n.y!==t.y),e.merge_parent()}merge_parent(){let t=this.parent,e=this,n=this.points.length;for(;t!==null;){for(let r of t.children)r!==e&&(n+=r.count_points());if(n>m.SPLIT_THRESHOLD)break;for(let r of t.children)t.points.push(...r.points),r.points=[];t.children=[],e=t,t=t.parent}}count_points(){return this.has_children()?this.children.reduce((t,e)=>t+e.count_points(),0):this.points.length}};d(m,"SPLIT_THRESHOLD",4);let N=m;class nt{constructor(){d(this,"birds");d(this,"quadtree");this.birds=[],this.quadtree=new N(l[0],l[1],[0],0,0)}add_bird(t){this.birds.push(t),this.quadtree.insert(t)}update(t){for(let e of this.birds){let n=0,r=0,i=0,h=0,f=0,[c,g]=[0,0],_=0;for(let[v,Z]of this.quadtree.search_range(e.x,e.y,P)){if(!(v instanceof M))throw new Error("Not a bird");Z<=V?(c+=e.x-v.x,g+=e.y-v.y,_++):(n+=v.vx,r+=v.vy,i++,h+=v.x,f+=v.y)}i>0&&(e.vx+=n*S/i,e.vy+=r*S/i,e.vx+=(h/i-e.x)*B,e.vy+=(f/i-e.y)*B),_>0&&(e.vx+=c*H/_,e.vy+=g*H/_),e.x<a?e.vx+=I:e.x>l[0]-a&&(e.vx-=I),e.y<a?e.vy+=I:e.y>l[1]-a&&(e.vy-=I);let p=J(e.vx*e.vx+e.vy*e.vy);p*L<1&&(e.vx*=p*L,e.vy*=p*L);let u=e.x+e.vx*t,w=e.y+e.vy*t;u<0?u=0:u>=l[0]&&(u=l[0]-.01),w<0?w=0:w>=l[1]&&(w=l[1]-.01);let T=this.quadtree.get_containing_node(e),o=new M(u,w,e.vx,e.vy);T.do_contain_point(o)?(e.x=u,e.y=w):(T.remove(e),e.x=u,e.y=w,this.quadtree.insert(e))}}render(t){K&&(t.strokeStyle="white",t.beginPath(),t.moveTo(a,a),t.lineTo(a,l[1]-a),t.lineTo(l[0]-a,l[1]-a),t.lineTo(l[0]-a,a),t.lineTo(a,a),t.stroke()),this.birds.forEach(e=>e.render(t))}}let X=document.getElementById("canvas1");if(!(X instanceof HTMLCanvasElement))throw new Error("Canvas 1 not found");const y=X,Y=y.getContext("2d");if(!Y)throw new Error("Canvas 1 context not found");const E=Y,rt=document.getElementById("control-panel");if(!(rt instanceof HTMLDivElement))throw new Error("Control panel not found");y.width=window.innerWidth-20;y.height=window.innerHeight-20;l[0]=y.width;l[1]=y.height;class it{constructor(t=50){d(this,"frame_time");d(this,"bird_count");d(this,"do_end",!1);let e=document.getElementById("frame_time_usage");if(!(e instanceof HTMLParagraphElement))throw new Error("Frame time usage not found");this.frame_time=e,this.bird_count=t,this.update_UI()}update_UI(){let t=document.getElementById("bird_count_slider");if(!(t instanceof HTMLInputElement))throw new Error("Bird count input not found");t.value=this.bird_count.toString(),t.onchange=n=>{if(!(n.target instanceof HTMLInputElement))throw new Error("Bird count input not found");this.bird_count=parseInt(n.target.value),this.do_end=!0};let e=document.getElementById("bird_count");if(!(e instanceof HTMLParagraphElement))throw new Error("Bird count not found");e.innerHTML=this.bird_count.toString()}reset_canvas(){E.clearRect(0,0,y.width,y.height),E.strokeStyle="white",E.lineWidth=1,E.beginPath(),E.rect(0,0,y.width,y.height),E.stroke()}async watch_dog(){for(;;)this.do_end=!1,await this.run(),this.update_UI()}async run(){const t=new nt;let e=a;for(let f=0;f<this.bird_count;f++){let c=.2,g=Math.random()*2*Math.PI;t.add_bird(new M(Math.random()*(l[0]-e*2)+e,Math.random()*(l[1]-e*2)+e,c*Math.cos(g),c*Math.sin(g)))}const n=1e3/60;let r=[],i=0,h=100;for(;!this.do_end;){let f=performance.now();if(this.reset_canvas(),t.update(n),t.render(E),r.length<h?r.push((performance.now()-f)/n):r[i]=(performance.now()-f)/n,i=(i+1)%h,i%40==0){let c=r.reduce((g,_)=>g+_,0)/r.length*100;c=Math.round(c*100)/100,this.frame_time.innerHTML=c.toString()+"%"}await new Promise(c=>setTimeout(c,n))}}}const R=()=>{let s=document.getElementById("sight_range");if(!(s instanceof HTMLInputElement))throw new Error("Sight range not found");s.value=P.toString(),s.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Sight range not found");k(parseInt(o.target.value))};const t=1e5;let e=document.getElementById("cohesion_str");if(!(e instanceof HTMLInputElement))throw new Error("Cohesion strength not found");e.value=(B*t).toString(),e.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Cohesion strength not found");A(parseFloat(o.target.value)/t)};const n=1e4;let r=document.getElementById("align_str");if(!(r instanceof HTMLInputElement))throw new Error("Alignment strength not found");r.value=(S*n).toString(),r.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Alignment strength not found");O(parseFloat(o.target.value)/n)};let i=document.getElementById("sep_range");if(!(i instanceof HTMLInputElement))throw new Error("Separation range not found");i.value=W.toString(),i.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Separation range not found");q(parseInt(o.target.value))};const h=1e4;let f=document.getElementById("sep_str");if(!(f instanceof HTMLInputElement))throw new Error("Separation strength not found");f.value=(H*h).toString(),f.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Separation strength not found");$(parseFloat(o.target.value)/h)};let c=document.getElementById("border_range");if(!(c instanceof HTMLInputElement))throw new Error("Border field range not found");c.value=a.toString(),c.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Border field range not found");F(parseInt(o.target.value))};const g=1e3;let _=document.getElementById("border_str");if(!(_ instanceof HTMLInputElement))throw new Error("Border field strength not found");_.value=(I*g).toString(),_.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Border field strength not found");C(parseFloat(o.target.value)/g)};let p=document.getElementById("show_sight_range");if(!(p instanceof HTMLInputElement))throw new Error("Show sight range not found");p.checked=z,p.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Show sight range not found");U(o.target.checked)};let u=document.getElementById("show_border_range");if(!(u instanceof HTMLInputElement))throw new Error("Show border field not found");u.checked=K,u.onchange=o=>{if(!(o.target instanceof HTMLInputElement))throw new Error("Show border field not found");D(o.target.checked)};let w=document.getElementById("default_setting");if(!(w instanceof HTMLButtonElement))throw new Error("Default setting not found");w.onclick=()=>{k(80),q(20),$(.003),O(.005),A(1e-4),j(.4),F(100),C(.02),U(!1),D(!1),b.bird_count=50,R(),b.update_UI(),b.do_end=!0};let T=document.getElementById("stress_setting");if(!(T instanceof HTMLButtonElement))throw new Error("Default setting not found");T.onclick=()=>{k(80),q(20),$(.003),O(.005),A(1e-4),j(.4),F(100),C(.02),U(!1),D(!1),b.bird_count=1e3,R(),b.update_UI(),b.do_end=!0}};R();const b=new it;b.watch_dog();