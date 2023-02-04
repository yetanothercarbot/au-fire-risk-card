class FireRiskCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div class="card-content" style="text-align: center">
            <svg version="1.1" width="210" height="150" xmlns="http://www.w3.org/2000/svg" style="transform: scale(1.3)">
            <g transform="translate(10, 10)"> <!-- Semicircle indicator card -->
              <path d="M 170.71067811865476 29.289321881345245 A 100 100 0 0 0 0 99.99999999999999 L 97 97 Z" stroke="black" stroke-width="0.5" fill="#64BF30"/> <!-- Moderate -->
              <path d="M 100 0 A 100 100 0 0 0 29.28932188134526 29.289321881345245 L 100 100 Z" stroke="black" stroke-width="0.5" fill="#FEDD3A"/> <!-- High -->
              <path d="M 170.71067811865476 29.28932188134526 A 100 100 0 0 0 100 0 L 100 100 Z" stroke="black" stroke-width="0.5" fill="#F78100"/> <!-- Extreme -->
              <path d="M 200 100 A 100 100 0 0 0 170.71067811865476 29.28932188134526 L 100 100 Z" stroke="black" stroke-width="0.5" fill="#AD0909"/> <!-- Catastrophic -->
              <path d="M 0.3 93 L 93 93 L 100 100 L 0 100 Z" stroke="black" stroke-width="0.5" fill="white" /> <!-- No rating -->
              
              <g id="needle" transform="translate(100, 98) rotate(0)"> <!-- Needle -->
                <path d="M 0 -2 L 0 2 L -80 2 L -82 0 L -80 -2 Z" stroke="black" stroke-width="0.5" fill="white" /> 
              </g>
          
              <path d="M 110 100 A 5 5 0 0 0 90 100" stroke="black" stroke-width="0.5" fill="white" /> <!-- Centre cutout -->
            </g>
            <g transform="translate(10, 115)"> <!-- Caption -->
              <rect id="captionBg" x="0" y="0" width="200" height="30" stroke="black" stroke-width="0.5" />
              <text id="captionText" x="100" y="17" font-size="25" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif"></text>
            </g>
          </svg>
          </div>
        </ha-card>
      `;
      this.needle = this.querySelector('#needle');
      this.captionBg = this.querySelector('#captionBg');
      this.captionText = this.querySelector('#captionText');
      this.reference = {
        "No Rating": {
          "angle": 0,
          "colour": "white",
          "text-colour": "black"
        },
        "Moderate": {
          "angle": 23,
          "colour": "#64BF30",
          "textColour": "black"
        },
        "High": {
          "angle": 67,
          "colour": "#FEDD3A",
          "textColour": "black"
        },
        "Extreme": {
          "angle": 113,
          "colour": "#F78100",
          "textColour": "black"
        },
        "Catastrophic": {
          "angle": 162,
          "colour": "#AD0909",
          "textColour": "white"
        }
      }
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unknown";

    this.captionText.textContent = stateStr.toUpperCase();
    if (stateStr in this.reference) {
      this.needle.setAttribute("transform", `translate(100, 98) rotate(${this.reference[stateStr].angle})`);
      this.captionBg.setAttribute("fill", this.reference[stateStr].colour);
      this.captionText.setAttribute("fill", this.reference[stateStr].textColour);
    } else {
      // If unknown state, move to 'No Rating'
      this.needle.setAttribute("transform", `translate(100, 98) rotate(0)`);
      this.captionBg.setAttribute("fill", "white");
      this.captionText.setAttribute("fill", "black");
    }
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define a fire danger source.');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('au-fire-risk-card', FireRiskCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "au-fire-risk-card",
  name: "Fire Risk Indicator",
  preview: false, // Optional - defaults to false
  description: "Show today's fire risk using information from the BOM weather integration" // Optional
});

