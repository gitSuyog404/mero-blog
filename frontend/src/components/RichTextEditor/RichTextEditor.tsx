import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
} from "react-icons/fa";

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Tell your story...",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && initialValue && !isInitialized) {
      editorRef.current.innerHTML = initialValue;
      setIsInitialized(true);
    }
  }, [initialValue, isInitialized]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();

      const clipboardData = e.clipboardData;
      const htmlData = clipboardData.getData("text/html");
      const textData = clipboardData.getData("text/plain");

      if (htmlData) {
        const cleanHtml = htmlData
          .replace(/<meta[^>]*>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

        document.execCommand("insertHTML", false, cleanHtml);
      } else if (textData) {
        document.execCommand("insertText", false, textData);
      }

      handleInput();
    },
    [handleInput]
  );

  const updateToolbar = useCallback(() => {
    const formats = new Set<string>();

    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
    } catch (e) {}

    setActiveFormats(formats);
  }, []);

  const handleSelectionChange = useCallback(() => {
    if (document.activeElement === editorRef.current) {
      updateToolbar();
    }
  }, [updateToolbar]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const formatText = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    updateToolbar();
    handleInput();
  };

  const insertHeading = (level: number) => {
    document.execCommand("formatBlock", false, `h${level}`);
    editorRef.current?.focus();
    handleInput();
  };

  const insertList = (type: "ul" | "ol") => {
    if (type === "ul") {
      document.execCommand("insertUnorderedList", false);
    } else {
      document.execCommand("insertOrderedList", false);
    }
    editorRef.current?.focus();
    handleInput();
  };

  const handleFocus = () => {
    setIsFocused(true);
    updateToolbar();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showPlaceholder = !editorRef.current?.textContent?.trim();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-lg border-2 transition-colors duration-200 ${
          isFocused ? "border-blue-500" : "border-gray-200"
        } ${className}`}
      >
        <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => formatText("bold")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("bold") ? "bg-gray-300" : ""
            }`}
            title="Bold"
          >
            <FaBold />
          </button>
          <button
            onClick={() => formatText("italic")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("italic") ? "bg-gray-300" : ""
            }`}
            title="Italic"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => formatText("underline")}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormats.has("underline") ? "bg-gray-300" : ""
            }`}
            title="Underline"
          >
            <FaUnderline />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => insertHeading(level)}
              className="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
              title={`Heading ${level}`}
            >
              H{level}
            </button>
          ))}

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            onClick={() => insertList("ul")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Bullet List"
          >
            <FaListUl />
          </button>
          <button
            onClick={() => insertList("ol")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Numbered List"
          >
            <FaListOl />
          </button>
        </div>

        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[300px] p-4 outline-none text-gray-900 leading-relaxed focus:ring-0"
            onInput={handleInput}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              direction: "ltr",
              textAlign: "left",
              writingMode: "horizontal-tb",
              textOrientation: "mixed",
              unicodeBidi: "normal",
              fontFamily: "inherit",
              fontSize: "16px",
              lineHeight: "1.6",
              letterSpacing: "normal",
              wordSpacing: "normal",
            }}
          />
          {showPlaceholder && (
            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none">
              {placeholder}
            </div>
          )}
        </div>
      </motion.div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        [contenteditable] {
          writing-mode: horizontal-tb !important;
          direction: ltr !important;
          text-orientation: mixed !important;
          unicode-bidi: normal !important;
        }
        
        [contenteditable] *,
        [contenteditable] *::before,
        [contenteditable] *::after {
          writing-mode: horizontal-tb !important;
          direction: ltr !important;
          text-orientation: mixed !important;
          unicode-bidi: normal !important;
          letter-spacing: normal !important;
          word-spacing: normal !important;
          text-align: inherit !important;
        }
        
        [contenteditable] p {
          display: block !important;
          margin: 0.5rem 0 !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
        }
        
        [contenteditable] h1,
        [contenteditable] h2,
        [contenteditable] h3,
        [contenteditable] h4,
        [contenteditable] h5,
        [contenteditable] h6 {
          display: block !important;
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
        }
        
        [contenteditable] h1 { font-size: 2rem !important; }
        [contenteditable] h2 { font-size: 1.5rem !important; }
        [contenteditable] h3 { font-size: 1.25rem !important; }
        
        [contenteditable] strong,
        [contenteditable] b {
          font-weight: bold !important;
          display: inline !important;
        }
        
        [contenteditable] em,
        [contenteditable] i {
          font-style: italic !important;
          display: inline !important;
        }
        
        [contenteditable] u {
          text-decoration: underline !important;
          display: inline !important;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          display: block !important;
          margin: 0.5rem 0 !important;
          padding-left: 2rem !important;
        }
        
        [contenteditable] li {
          display: list-item !important;
          margin: 0.25rem 0 !important;
        }
        
        [contenteditable] ul li {
          list-style-type: disc !important;
        }
        
        [contenteditable] ol li {
          list-style-type: decimal !important;
        }
        
        [contenteditable] br {
          display: block !important;
          content: "" !important;
          margin: 0.5rem 0 !important;
        }
        `,
        }}
      />
    </>
  );
};

export default RichTextEditor;
