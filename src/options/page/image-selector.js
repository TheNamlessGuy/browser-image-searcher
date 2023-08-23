customElements.define('image-selector', class ImageSelectorElement extends HTMLElement {
  _value = null;
  _imgDisplay = null;
  _dropdown = null;

  static observedAttributes = ['opts'];

  constructor(data = {}) {
    super();

    const anchor = document.createElement('span');
    anchor.classList.add('anchor');
    anchor.addEventListener('click', (e1) => {
      this._dropdown.style.marginTop = anchor.getBoundingClientRect().height + 'px';

      if (this._dropdown.style.display === 'none') {
        this._dropdown.style.display = null;
        const listener = (e2) => {
          if (e1 === e2) { return; }

          document.removeEventListener('click', listener);
          this._dropdown.style.display = 'none';
        };
        document.addEventListener('click', listener);
      }
    });

    this._imgDisplay = document.createElement('img');
    this._imgDisplay.style.visibility = 'hidden';
    anchor.appendChild(this._imgDisplay);

    const downarrow = document.createElement('span');
    downarrow.innerText = '⏷';
    anchor.appendChild(downarrow);

    this._dropdown = document.createElement('div');
    this._dropdown.classList.add('dropdown');
    this._dropdown.style.display = 'none';
    anchor.appendChild(this._dropdown);

    const style = document.createElement('style');
    style.textContent = `
.anchor {
  display: flex;
  width: fit-content;
  height: fit-content;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
}

.dropdown {
  position: absolute;
  z-index: 9999;
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
  width: 100%;
}

.dropdown > div {
  width: 100%;
  height: fit-content;
}
.dropdown > div:hover { background-color: blue; }
img { width: 16px; height: 16px; padding: 2px; }
`;
    anchor.appendChild(style);

    this.attachShadow({mode: 'closed'}).appendChild(anchor);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'opts') {
      const opts = newValue.split(',');
      for (const opt of opts) {
        const container = document.createElement('div');
        const img = document.createElement('img');
        img.src = `/res/icons/engines/${opt}/16.png`;
        container.appendChild(img);
        container.addEventListener('click', () => this._setValue(opt));
        this._dropdown.appendChild(container);
      }
    }
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._setValue(value);
  }

  _setValue(value) {
    this._value = value;
    this._imgDisplay.style.visibility = null;
    this._imgDisplay.src = `/res/icons/engines/${value}/16.png`;
  }
});