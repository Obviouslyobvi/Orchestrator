import { useState } from 'react';

const NewProjectModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      return;
    }
    onCreate({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Start a New Project</h3>
          <button onClick={onClose} className="text-muted">
            ✕
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Project Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-base px-4 py-3 text-sm outline-none"
              placeholder="Ex: Launch a mobile app"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 h-32 w-full resize-none rounded-xl border border-border bg-base px-4 py-3 text-sm outline-none"
              placeholder="Describe the outcome you want to achieve..."
            />
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
