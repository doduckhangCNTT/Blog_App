import React from "react";
import "react-quill/dist/quill.snow.css"; // ES6
import ReactQuill from "react-quill";

interface IProps {
  body: string;
  setBody: (body: string) => void;
}

const LiteQuill: React.FC<IProps> = ({ body, setBody }) => {
  const modules = { toolbar: { container } };

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={modules}
        placeholder="Write somethings..."
        onChange={(e) => setBody(e)}
        value={body}
      />
    </div>
  );
};

let container = [
  [{ font: [] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
];

export default LiteQuill;
