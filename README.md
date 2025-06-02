![Uzbekistan Flag Sticker (2)](https://github.com/user-attachments/assets/438fbebb-dfcc-44df-b08f-02f648c61d48)

# UZCSS Lang

A custom CSS preprocessor that allows developers to write CSS using `Uzbek` property and value names, which are then compiled into standard English CSS. This project aims to make web styling more accessible and intuitive for Uzbek-speaking developers.

---

## 🌟 Features

- **Uzbek Syntax:** Write CSS properties and values in Uzbek.
- **Automatic Translation:** Seamlessly translates Uzbek CSS syntax to standard English CSS.
- **Glob Pattern Support:** Compile multiple `.uzcss` files across directories using glob patterns.
- **Directory Structure Preservation:** Maintains your original directory structure in the output.
- **Configurable Translations:** Easily extend or modify the Uzbek-to-English translation mappings.
- **Colorful CLI Output:** Provides clear and informative messages during compilation.

---

## 🚀 Getting Started

Follow these steps to set up and run the UZCSS compiler in your project.

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager) or Yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/usmonovshohruxmirzo/uzcss.git
    cd uzcss
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
    This will install `chalk`, `fast-glob`, and `fs-extra` which are required by the compiler.

---

## 💡 Usage

The UZCSS compiler is designed to be run via a script in your `package.json`.

### 1. Configure `package.json`

Add the following script to the `"scripts"` section of your `package.json` file. Ensure you also have `"type": "module"` if you are using ES Modules (which `index.mjs` does).

```json
{
  "scripts": {
    "uzcss": "node src/index.mjs \"styles/**/*.uzcss\" \"dist\""
  },
  "type": "module" // Make sure this line is present at the top level
}
```

- `"styles/**/*.uzcss"`: This is the **input glob pattern**. It tells the compiler to look for all files ending with `.uzcss` inside the `styles` directory and any of its subdirectories.
- `"dist"`: This is the **output directory** where the compiled `.css` files will be saved. The compiler will mirror the input directory structure within `dist`.

### 2\. Create your `.uzcss` files

Place your Uzbek CSS files in the `styles` directory (or any subdirectory within it).

**Example: `styles/main.uzcss`**

```uzcss
body {
  rang: qora;
  orqa-fon-rangi: qizil;
  matn-holat: markaz;
  shrft-o`lchami: 16px;
  kenglik: 500px;
  ichki-bo`shliq: 100px;
  chegaralar: 10px;
  balandlik: 500px;
}

header {
  kenglik: 10rem;
  balandlik: 500px;
}
```

### 3\. Run the compiler

Execute the `uzcss` script from your terminal in the project's root directory:

```bash
npm run uzcss
# or
yarn uzcss
```

### 4\. Check the output

After running the command, you will find the compiled `.css` files in your specified output directory (e.g., `dist/styles/main.css`).

**Example: `dist/styles/main.css` (generated from `styles/main.uzcss`)**

```css
body {
  color: black;
  background-color: red;
  text-align: center;
  font-size: 16px;
  width: 500px;
  padding: 100px;
  margin: 10px;
  height: 500px;
}

header {
  width: 10rem;
  height: 500px;
}
```

---

## 📂 Project Structure

```
uzcss/
├── src/
│   └── index.mjs             # The main compiler script
├── config/
│   └── uzcss.config.mjs      # Translation maps (Uzbek to English)
├── styles/
│   ├── main.uzcss            # Example UZCSS file
│   └── components/
│       └── button.uzcss      # Example UZCSS file in a subdirectory
├── dist/                     # Output directory for compiled CSS (created automatically)
├── package.json              # Project dependencies and scripts
└── README.md                 # This documentation file
```

---

## ⚙️ Configuration

The core of the translation logic resides in `config/uzcss.config.mjs`. You can customize or extend the translation mappings here.

**`config/uzcss.config.mjs`**

```javascript
export const properties = {
  rang: "color",
  "fon-rang": "background-color",
  kenglik: "width",
  balandlik: "height",
  // ... add more Uzbek property names and their English equivalents
};

export const values = {
  chap: "left",
  "o`ng": "right",
  markaz: "center",
  qizil: "red",
  "ko`k": "blue",
  // ... add more Uzbek value names and their English equivalents
};
```

- **`properties`**: An object where keys are Uzbek CSS property names and values are their standard English CSS equivalents.
- **`values`**: An object where keys are Uzbek CSS value names and values are their standard English CSS equivalents.

---

## 🤝 Contributing

Contributions are welcome\! If you have suggestions for new Uzbek terms, improvements to the compiler, or bug fixes, please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](./LICENSE) file for details.

---

## ❓ Support and Contact

If you have any questions or need assistance, please open an issue in the GitHub repository.
