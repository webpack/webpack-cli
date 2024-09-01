html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
:root {
    --color-primary: #1C78C0;
    --color-secondary: #8ED6FB;
    --color-dark: #2C3E50;
    --color-background: #f0f0f0;
}
.heading {
    font-weight: 300;
    bg-color: #f0f0f0;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

span {
  color: var(--color-primary);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--color-background);
}

ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

p {
  font-size: 1.2rem;
  line-height: 1.5;
}

li {
  display: flex;
  align-items: center;
}

button {
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 1.25rem;
  cursor: pointer;
  margin: 0 1rem;
}

a {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: bold;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}
.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-dark);
}
.btn-primary:hover {
  background-color: #0E5A8A;
}
.btn-secondary:hover {
  background-color: #6EB8E0;
}
