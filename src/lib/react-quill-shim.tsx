import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value = '',
  onChange,
  className = '',
  placeholder,
  readOnly = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string, argument?: string) => {
    if (readOnly) return;
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    onChange?.(editorRef.current?.innerHTML ?? '');
  };

  const addLink = () => {
    const url = window.prompt('أدخل الرابط');
    if (url && /^https?:\/\//i.test(url)) runCommand('createLink', url);
  };

  return (
    <div className={`local-rich-editor ${className}`}>
      {!readOnly && (
        <div className="flex flex-wrap gap-2 border border-b-0 border-gray-200 rounded-t-lg bg-gray-50 p-2">
          <button type="button" onClick={() => runCommand('bold')} className="px-3 py-1 rounded bg-white border font-bold" aria-label="عريض">B</button>
          <button type="button" onClick={() => runCommand('italic')} className="px-3 py-1 rounded bg-white border italic" aria-label="مائل">I</button>
          <button type="button" onClick={() => runCommand('underline')} className="px-3 py-1 rounded bg-white border underline" aria-label="تحته خط">U</button>
          <button type="button" onClick={() => runCommand('insertUnorderedList')} className="px-3 py-1 rounded bg-white border" aria-label="قائمة">• قائمة</button>
          <button type="button" onClick={addLink} className="px-3 py-1 rounded bg-white border" aria-label="رابط">رابط</button>
          <button type="button" onClick={() => runCommand('removeFormat')} className="px-3 py-1 rounded bg-white border" aria-label="مسح التنسيق">مسح التنسيق</button>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(event) => onChange?.(event.currentTarget.innerHTML)}
        className={`min-h-40 border border-gray-200 bg-white p-4 outline-none ${readOnly ? 'rounded-lg' : 'rounded-b-lg'} empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`}
      />
    </div>
  );
}
