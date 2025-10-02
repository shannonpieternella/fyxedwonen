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
    color: #333;
    line-height: 1.6;
    padding-top: 70px; /* offset for fixed header */
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
