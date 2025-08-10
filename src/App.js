import React, { useState } from "react";
import { marked } from "marked";
import "./App.css";

marked.setOptions({
  breaks: true,
});

const initialMarkdown = `# Markdown Previewer

## Bu yerda markdown yoziladi

[Google](https://www.google.com)

\`inline code\`

\`\`\`js
// code block
console.log("Salom, dunyo!");
\`\`\`

- Ro'yxat elementi 1
- Ro'yxat elementi 2

> Bu blok sitata.

![Tasvir](https://via.placeholder.com/150)

**Qalin matn**
`;

export default function App() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  const handleChange = (e) => setMarkdown(e.target.value);

  return (
    <div className="container">
      <h1 className="title">Markdown Previewer</h1>
      <div className="previewer">
        <textarea
          id="editor"
          value={markdown}
          onChange={handleChange}
          className="editor"
        />
        <div
          id="preview"
          className="preview"
          dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
        />
      </div>
    </div>
  );
}
