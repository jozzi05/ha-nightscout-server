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
    animation: glucose-blink 2s ease-in-out;
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
