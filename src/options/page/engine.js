customElements.define('engine-list-entry', class EngineListEntryElement extends HTMLElement {
  _imageSelector;
  _title;
  _url;

  static observedAttributes = ['title', 'image', 'url'];

  constructor() {
    super();

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.classList.add('list-entry');

    this._imageSelector = document.createElement('image-selector');
    this._imageSelector.setAttribute('opts', 'google,saucenao,tineye,yandex,custom');
    container.appendChild(this._imageSelector);

    this._title = document.createElement('input');
    this._title.type = 'text';
    this._title.placeholder = 'Title';
    this._title.style.flexGrow = 1;
    container.appendChild(this._title);

    this._url = document.createElement('input');
    this._url.type = 'text';
    this._url.placeholder = 'URL';
    this._url.style.flexGrow = 10;
    container.appendChild(this._url);

    const up = document.createElement('button');
    up.addEventListener('click', () => {
      const idx = Array.from(this.parentElement.children).indexOf(this);
      if (idx > 0) {
        this.parentElement.insertBefore(this, this.parentElement.children[idx - 1]);
      }
    });
    up.innerText = '↑';
    container.appendChild(up);

    const down = document.createElement('button');
    down.addEventListener('click', () => {
      const idx = Array.from(this.parentElement.children).indexOf(this);
      if (idx < this.parentElement.children.length - 2) {
        this.parentElement.insertBefore(this, this.parentElement.children[idx + 2]);
      } else if (idx === this.parentElement.children.length - 2) {
        this.parentElement.appendChild(this);
      }
    });
    down.innerText = '↓';
    container.appendChild(down);

    const begone = document.createElement('button');
    begone.addEventListener('click', () => this.remove());
    begone.innerText = '🗑';
    container.appendChild(begone);

    this.attachShadow({mode: 'closed'}).appendChild(container);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title') {
      this._title.value = newValue;
    } else if (name === 'image') {
      this._imageSelector.value = newValue;
    } else if (name === 'url') {
      this._url.value = newValue;
    }
  }

  get value() {
    return {
      display: this._title.value,
      url: this._url.value,
      type: 'GET',
      icon: this._imageSelector.value,
    };
  }
});