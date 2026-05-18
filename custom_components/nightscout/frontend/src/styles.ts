import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    overflow: hidden;
    box-sizing: border-box;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
  }

  ha-card.blink {
    animation: glucose-blink 5s ease-in;
  }

  @keyframes glucose-blink {
    0% {
      border-color: var(--blink-color, transparent);
    }
    20% {
      border-color: var(--blink-color, transparent);
    }
    100% {
      border-color: transparent;
    }
  }

  .ns-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ns-glucose {
    font-weight: bold;
    line-height: 1;
  }

  .ns-arrow {
    font-weight: bold;
    line-height: 1;
  }

  .ns-secondary {
    opacity: 0.85;
  }

  .ns-time-ago {
    opacity: 0.6;
    margin-top: 2px;
  }

  .ns-label {
    opacity: 0.6;
    margin-right: 2px;
  }

  .ns-not-available {
    opacity: 0.5;
    font-style: italic;
    padding: 16px 0;
  }
`;

export const editorStyles = css`
  :host {
    display: block;
    font-family: var(--ha-font-family-body, var(--primary-font-family, "Roboto", sans-serif));
    color: var(--primary-text-color);
    -webkit-font-smoothing: antialiased;
  }

  .editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px 0 8px;
    box-sizing: border-box;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }

  .panel-title {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--secondary-text-color, var(--primary-text-color));
    opacity: 0.85;
  }

  .hint {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.45;
    color: var(--secondary-text-color, var(--primary-text-color));
    opacity: 0.8;
  }

  .field-select,
  .field-input,
  .field-number {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    font: inherit;
    font-size: 0.9rem;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: 8px;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .field-select:focus,
  .field-input:focus,
  .field-number:focus {
    border-color: var(--primary-color, #03a9f4);
    box-shadow: 0 0 0 1px var(--primary-color, #03a9f4);
  }

  .field-number {
    width: 4.5rem;
    text-align: center;
    padding: 6px 8px;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
    gap: 8px 12px;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 0.9rem;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-item input {
    width: 1rem;
    height: 1rem;
    margin: 0;
    accent-color: var(--primary-color, #03a9f4);
    cursor: pointer;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .slider-row input[type="range"] {
    flex: 1;
    min-width: 0;
    accent-color: var(--primary-color, #03a9f4);
  }

  .slider-value {
    flex-shrink: 0;
    min-width: 3rem;
    padding: 4px 10px;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    border-radius: 6px;
    background: var(--card-background-color, rgba(0, 0, 0, 0.06));
    color: var(--primary-text-color);
  }

  .range-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 14px;
  }

  .range-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.8rem;
    color: var(--secondary-text-color, var(--primary-text-color));
  }

  .color-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
  }

  .color-field {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
  }

  .color-field input[type="color"] {
    width: 2.25rem;
    height: 2.25rem;
    padding: 2px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
  }

  .entity-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .entity-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .entity-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--secondary-text-color, var(--primary-text-color));
    text-transform: capitalize;
  }

  .entity-field .field-input {
    font-family: var(--code-font-family, ui-monospace, monospace);
    font-size: 0.8rem;
  }
`;
