import { css } from "lit";

export const styles = css`
    :host {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .reward-box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background-color: #4b5563;
      border: 2px solid #1f2937;
      box-shadow: var(--wa-shadow-medium);
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .reward-box.has-image {
      background-color: transparent;
      border-color: transparent;
      box-shadow: none;
      animation: float 3s ease-in-out infinite;
    }

    .reward-img {
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
	  object-fit: contain;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;
