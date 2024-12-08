// Definición de la clase que extiende HTMLElement
export default class AttributesForm extends HTMLElement {

    #key
    #object
    #attrs
    #listeners

    constructor() {
      super();

      this.#listeners = [];
    }

    get object() { return this.#object; }
    get attrs() { return this.#attrs; }

    addListener(l) { this.#listeners.push(l);}

    setTarget(key, object, attrs) {
        this.#key = key;
        this.#object = object;
        this.#attrs = attrs;
        this.#render();
    }
  
    connectedCallback() {

    }
  
    disconnectedCallback() {
    }
  
    static get observedAttributes() {
      return [];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
    }

    #render() {
        this.innerHTML = '';

        const row = document.createElement('div'); {

            const label = document.createElement('label');
            label.textContent = this.#key;
            row.appendChild(label);
        }
        this.appendChild(row);

        this.#attrs.forEach(
            (attr) => {

                const row = document.createElement('div'); {

                    const label = document.createElement('label');
                    label.textContent = attr;
                    row.appendChild(label);
                    
                    const input = document.createElement('input');
                    input.setAttribute('type', 'text');
                    input.setAttribute('value', this.#object[attr]);
                    input.addEventListener('change',
                        (evt) => {
                            this.#raiseEvent({attr, 'value' : input.value})
                        }
                    );
                    row.appendChild(input);
                }
                this.appendChild(row);

            }
        )
    }

    #raiseEvent({attr, value}) {

        this.#listeners.forEach(
            (l) => {
                l({sender : this, attr, value});
            }
        );
    }
  }
  
  customElements.define('attributes-form', AttributesForm);
  