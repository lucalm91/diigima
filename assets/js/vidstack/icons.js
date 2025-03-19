const s = {
    "accessibility": () => import("./icons/accessibility.js"),
    "airplay": () => import("./icons/airplay.js"),
    "camera": () => import("./icons/camera.js"),
    "caption": () => import("./icons/caption.js"),
    "chevron-down": () => import("./icons/chevron-down.js"),
    "chevron-left": () => import("./icons/chevron-left.js"),
    "chevron-right": () => import("./icons/chevron-right.js"),
    "chevron-up": () => import("./icons/chevron-up.js"),
    "fullscreen-exit": () => import("./icons/fullscreen-exit.js"),
    "fullscreen": () => import("./icons/fullscreen.js"),
    "heart": () => import("./icons/heart.js"),
    "pause": () => import("./icons/pause.js"),
    "picture-in-picture-exit": () => import("./icons/picture-in-picture-exit.js"),
    "picture-in-picture": () => import("./icons/picture-in-picture.js"),
    "play": () => import("./icons/play.js"),
    "replay": () => import("./icons/replay.js"),
    "settings": () => import("./icons/settings.js"),
    "volume-high": () => import("./icons/volume-high.js"),
    "volume-low": () => import("./icons/volume-low.js"),
    "x-mark": () => import("./icons/x-mark.js")
};

const i = function(s) {
    const i = document.createElement("template");
    return i.innerHTML = s, i.content
}('<svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg>');

class e extends HTMLElement {
    constructor() {
        super(...arguments),
        this.e = this.n(),
        this.t = null
    }
    static get observedAttributes() {
        return ["type"]
    }
    get type() {
        return this.t
    }
    set type(s) {
        this.t !== s && (s ? this.setAttribute("type", s) : this.removeAttribute("type"),
        this.i(s))
    }
    attributeChangedCallback(s, i, e) {
        if ("type" === s) {
            const s = e || null;
            this.t !== s && this.i(s)
        }
    }
    connectedCallback() {
        this.classList.add("vds-icon"),
        this.e.parentNode !== this && this.prepend(this.e)
    }
    n() {
        return i.cloneNode(!0).firstElementChild
    }
    a() {
        const i = this.t;
        i && s[i] ? s[i]().then(({default: s})=> {
            i === this.t && this.s(s)
        }) : this.s("")
    }
    i(s) {
        this.t = s,
        this.a()
    }
    s(s) {
        this.e.innerHTML = s
    }
}

e.tagName = "media-icon";
window.customElements.get(e.tagName) || window.customElements.define(e.tagName, e);
export {e as MediaIconElement};
export default null;
