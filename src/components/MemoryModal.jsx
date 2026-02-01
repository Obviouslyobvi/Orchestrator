import { useEffect, useState } from 'react';

const tagOptions = ['Preference', 'Decision', 'Snippet'];

const MemoryModal = ({ initialValue, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState(tagOptions[0]);

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title || '');
      setContent(initialValue.content || '');
      setTag(initialValue.tag || tagOptions[0]);
    }
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }
    onSave({
      ...initialValue,
      title: title.trim(),
      content: content.trim(),
      tag
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Save to Memory</h3>
          <button onClick={onClose} className="text-muted">
            ✕
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-base px-4 py-3 text-sm outline-none"
              placeholder="Ex: Brand voice"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Content
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mt-2 h-32 w-full resize-none rounded-xl border border-border bg-base px-4 py-3 text-sm outline-none"
              placeholder="Add the context you want to remember..."
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Tag
            </label>
            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-base px-4 py-3 text-sm"
            >
              {tagOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black"
            >
              Save Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoryModal;
