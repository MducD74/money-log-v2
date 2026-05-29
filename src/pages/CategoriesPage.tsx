import { FormEvent, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { db } from '../db/db';
import { useCategories } from '../hooks/useMoneyData';

export function CategoriesPage() {
  const categories = useCategories();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveCategory(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSaving(true);
    if (editingId) {
      await db.categories.update(editingId, { name: trimmed });
    } else {
      await db.categories.add({ name: trimmed, createdAt: new Date().toISOString() });
    }

    setName('');
    setEditingId(null);
    setSaving(false);
  }

  async function deleteCategory(id: number) {
    const used = await db.expenses.where('categoryId').equals(id).count();
    if (used > 0) {
      alert('Không thể xóa hạng mục đã có chi tiêu.');
      return;
    }

    if (!confirm('Xóa hạng mục này và budget liên quan?')) return;

    await db.transaction('rw', db.categories, db.budgets, async () => {
      await db.categories.delete(id);
      await db.budgets.where('categoryId').equals(id).delete();
    });
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <h2>Hạng mục</h2>
          <p>Tổ chức chi tiêu theo nhóm dễ theo dõi.</p>
        </div>
      </div>

      <form className="formPanel categoryForm" onSubmit={saveCategory}>
        <label className="field">
          <span>{editingId ? 'Đổi tên hạng mục' : 'Hạng mục mới'}</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Sức khỏe" />
        </label>
        <button className="primaryButton" type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : editingId ? 'Cập nhật hạng mục' : 'Thêm hạng mục'}
        </button>
      </form>

      {categories.length === 0 ? (
        <EmptyState title="Chưa có hạng mục" note="Thêm hạng mục đầu tiên để bắt đầu." />
      ) : (
        <div className="categoryManageGrid">
          {categories.map((category) => (
            <article className="categoryManageCard" key={category.id}>
              <div className="categoryAvatar">{category.name.slice(0, 1).toUpperCase()}</div>
              <strong>{category.name}</strong>
              <div className="rowActions">
                <button
                  className="ghostButton"
                  type="button"
                  onClick={() => {
                    setEditingId(category.id ?? null);
                    setName(category.name);
                  }}
                >
                  Sửa
                </button>
                <button className="dangerButton" type="button" onClick={() => deleteCategory(category.id!)}>
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
