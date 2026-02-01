import { useState } from 'react';
import MemoryModal from './MemoryModal';

const tagStyles = {
  Preference: 'bg-purple-500/20 text-purple-300',
  Decision: 'bg-blue-500/20 text-blue-300',
  Snippet: 'bg-emerald-500/20 text-emerald-300'
};

const MemoryPanel = ({ items, onClose, onSave, onDelete }) => {
  const [activeTag, setActiveTag] = useState('All');
  const [editingItem, setEditingItem] = useState(null);

  const tags = ['All', 'Preference', 'Decision', 'Snippet'];

  const filtered =
    activeTag === 'All'
      ? items
      : items.filter((item) => item.tag === activeTag);

  return (
    <div className="fixed inset-0 z-30 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="h-full w-full max-w-lg border-l border-border bg-base p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Memory</h2>
          <button
            onClick={() => setEditingItem({})}
            className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black"
          >
            Add New
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full border px-3 py-1 ${
                activeTag === tag
                  ? 'border-accent text-accent'
                  : 'border-border text-muted'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="space-y-4 overflow-y-auto pr-2">
          {filtered.length === 0 && (
            <p className="text-sm text-muted">No memory items yet.</p>
          )}
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] ${
                      tagStyles[item.tag] || 'bg-white/10 text-muted'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                </div>
                <div className="flex gap-2 text-xs text-muted">
                  <button onClick={() => setEditingItem(item)}>Edit</button>
                  <button onClick={() => onDelete(item.id)}>Delete</button>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
      {editingItem !== null && (
        <MemoryModal
          initialValue={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(data) => {
            onSave(data);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default MemoryPanel;
