import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  /* Prevent accidental horizontal scroll on mobile */
  body {
    overscroll-behavior-x: none;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.bg};
    line-height: 1.6;
    padding-top: 70px; /* offset for fixed header */
    transition: background 0.25s ease, color 0.25s ease;
    scroll-behavior: smooth;
  }

  ::selection { background: rgba(56,182,255,0.2); }

  /* Clean link focus for accessibility */
  a, button, input, select, textarea {
    &:focus-visible {
      outline: 2px solid #38b6ff;
      outline-offset: 2px;
    }
  }

  /* Subtle reveal animations */
  .reveal { opacity: 0; transform: translateY(12px); transition: opacity .5s ease, transform .5s ease; }
  .reveal.is-visible { opacity: 1; transform: translateY(0); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
    .reveal, .reveal.is-visible { opacity: 1 !important; transform: none !important; }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 15px;
    }
  }
`;

export default GlobalStyles;
