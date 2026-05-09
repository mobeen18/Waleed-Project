// BudgetPage.jsx — Budget module
// Users can set a monthly spending limit, add per-category limits,
// and see live status (safe / nearLimit / exceeded) pulled from the backend

import { useState, useEffect } from 'react';
import {
  createBudget,
  getBudgets,
  getCurrentBudget,
  updateBudget,
  deleteBudget,
} from '../services/budgetServices';
import '../styles/global.css';

// ─── Embedded CSS ─────────────────────────────────────────────────────────────
const budgetStyles = `
/* BudgetPage.css — Styles for the Budget module */

/* ─── Page Wrapper ───────────────────────────────────────────────────────── */
.budget-page {
  padding: var(--space-3);
  background: var(--color-bg);
  min-height: 100vh;
}

.budget-page__inner {
  max-width: 1100px;
  margin: 0 auto;
}

/* ─── Page Header ────────────────────────────────────────────────────────── */
.budget-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.budget-page__title {
  font-size: var(--text-h1);
  font-weight: 700;
  color: var(--color-navy);
}

/* ─── Current Month Panel ────────────────────────────────────────────────── */
.current-budget-panel {
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  box-shadow: var(--shadow);
}

.current-budget-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.current-budget-panel__title {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-navy);
}

/* ─── Progress Bar ───────────────────────────────────────────────────────── */
.progress-section {
  margin-bottom: var(--space-2);
}

.progress-section__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.progress-section__label {
  font-size: var(--text-body);
  color: #555;
}

.progress-section__amounts {
  font-size: var(--text-body);
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--color-text);
}

.progress-track {
  background: var(--color-bg);
  border-radius: var(--border-radius);
  height: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--border-radius);
  transition: width 0.4s ease;
}

/* Progress fill colors based on status */
.progress-fill--safe      { background-color: var(--color-green); }
.progress-fill--nearLimit { background-color: var(--color-amber); }
.progress-fill--exceeded  { background-color: var(--color-red); }

.progress-section__pct {
  font-size: var(--text-small);
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* ─── Category Breakdown Grid ────────────────────────────────────────────── */
.category-breakdown__title {
  font-size: var(--text-body);
  font-weight: 600;
  color: #555;
  margin-bottom: 12px;
}

.category-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-2);
}

.category-card {
  background: var(--color-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--space-2);
}

.category-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-card__name {
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--color-text);
}

.category-card__amounts {
  font-size: var(--text-small);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-top: 6px;
}

/* ─── Budget Cards Grid ──────────────────────────────────────────────────── */
.budget-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-2);
}

.budget-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-2);
  box-shadow: var(--shadow);
}

.budget-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.budget-card__month {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-navy);
}

.budget-card__amounts {
  font-size: var(--text-small);
  font-family: var(--font-mono);
  color: #555;
  margin: 6px 0 12px;
}

.budget-card__actions {
  display: flex;
  gap: var(--space-1);
}

.budget-card__actions .btn {
  flex: 1;
}

/* ─── Category Limit Row (inside modal) ──────────────────────────────────── */
.cat-limit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  padding: 8px 12px;
  margin-bottom: 8px;
}

.cat-limit-row__name {
  font-size: var(--text-body);
  font-weight: 600;
}

.cat-limit-row__amount {
  font-size: var(--text-body);
  font-family: var(--font-mono);
  color: #555;
}

.cat-limit-add-row {
  display: flex;
  gap: var(--space-1);
  margin-top: 8px;
}

.cat-limit-add-row select,
.cat-limit-add-row input {
  flex: 1;
  height: var(--button-height);
  padding: 0 12px;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  font-size: var(--text-small);
  font-family: var(--font-main);
}

/* ─── Range Slider hint ──────────────────────────────────────────────────── */
.slider-hint {
  font-size: var(--text-small);
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* ─── Empty / Loading states ─────────────────────────────────────────────── */
.budget-empty,
.budget-loading {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: 48px var(--space-2);
  text-align: center;
  box-shadow: var(--shadow);
  color: var(--color-text-muted);
}

.budget-empty p:first-child {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}
`;


// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'Ultrasound Machine',
  'X-Ray Machine',
  'MRI Scanner',
  'CT Scanner',
  'ECG/EKG Machine',
  'EEG Machine',
  'Digital Thermometer',
  'Blood Pressure Monitor',
  'Glucometer',
  'Pulse Oximeter',
];

// Default blank form
const EMPTY_FORM = {
  month: new Date().toISOString().slice(0, 7), // current month in YYYY-MM
  totalLimit: '',
  warningThreshold: 80,
  categoryLimits: [],
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function BudgetPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [budgets, setBudgets]               = useState([]);
  const [currentBudget, setCurrentBudget]   = useState(null);
  const [form, setForm]                     = useState(EMPTY_FORM);
  const [editingId, setEditingId]           = useState(null);
  const [showModal, setShowModal]           = useState(false);
  const [newCatLimit, setNewCatLimit]       = useState({ category: '', limit: '' });
  const [loading, setLoading]               = useState(true);
  const [submitLoading, setSubmitLoading]   = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState('');

  // ── Data Fetching ──────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all budgets and current month budget in parallel
      // Use allSettled so one failure doesn't block the other
      const [allRes, curRes] = await Promise.allSettled([
        getBudgets(),
        getCurrentBudget(),
      ]);

      if (allRes.status === 'fulfilled') setBudgets(allRes.value.data.data);
      // 404 just means no current budget is set — not a real error
      if (curRes.status === 'fulfilled') setCurrentBudget(curRes.value.data.data);
    } catch (err) {
      setError('Failed to load budgets. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // ── Category Limit Helpers ──────────────────────────────────────────────────

  // Add a new category limit row to the form
  const addCategoryLimit = () => {
    if (!newCatLimit.category || !newCatLimit.limit || Number(newCatLimit.limit) <= 0) return;

    // Prevent duplicate categories
    const alreadyAdded = form.categoryLimits.find((cl) => cl.category === newCatLimit.category);
    if (alreadyAdded) {
      setError(`${newCatLimit.category} limit already set`);
      return;
    }

    setForm({
      ...form,
      categoryLimits: [
        ...form.categoryLimits,
        { category: newCatLimit.category, limit: Number(newCatLimit.limit) },
      ],
    });
    setNewCatLimit({ category: '', limit: '' });
    setError('');
  };

  // Remove a category limit row
  const removeCategoryLimit = (category) => {
    setForm({
      ...form,
      categoryLimits: form.categoryLimits.filter((cl) => cl.category !== category),
    });
  };

  // ── Form Handlers ──────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        totalLimit: Number(form.totalLimit),
        warningThreshold: Number(form.warningThreshold),
      };

      if (editingId) {
        await updateBudget(editingId, payload);
        setSuccess('Budget updated successfully');
      } else {
        await createBudget(payload);
        setSuccess('Budget created successfully');
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setForm({
      month: budget.month,
      totalLimit: budget.totalLimit,
      warningThreshold: budget.warningThreshold,
      categoryLimits: budget.categoryLimits || [],
    });
    setEditingId(budget._id);
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await deleteBudget(id);
      setSuccess('Budget deleted');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete budget.');
    }
  };

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  // Returns the correct CSS class for the progress bar fill color
  const getProgressClass = (status) => `progress-fill progress-fill--${status}`;

  // Calculate progress bar width — capped at 100%
  const getProgressWidth = (spent, limit) =>
    `${Math.min(Math.round((spent / limit) * 100), 100)}%`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{budgetStyles}</style>
      <div className="budget-page">
        <div className="budget-page__inner">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="budget-page__header">
          <h1 className="budget-page__title">Budget Tracker</h1>
          <button className="btn btn--primary" onClick={openAddModal}>
            + Set Budget
          </button>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────────── */}
        {error   && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        {/* ── Current Month Panel ──────────────────────────────────────────── */}
        {currentBudget && (
          <div className="current-budget-panel">
            <div className="current-budget-panel__header">
              <h2 className="current-budget-panel__title">
                This Month — {currentBudget.month}
              </h2>
              <span className={`badge badge--${currentBudget.status}`}>
                {currentBudget.status === 'safe'      && 'Safe'}
                {currentBudget.status === 'nearLimit' && 'Near Limit'}
                {currentBudget.status === 'exceeded'  && 'Exceeded'}
              </span>
            </div>

            {/* Overall progress bar */}
            <div className="progress-section">
              <div className="progress-section__meta">
                <span className="progress-section__label">Overall Spending</span>
                <span className="progress-section__amounts">
                  PKR {currentBudget.spentAmount?.toLocaleString()} / {currentBudget.totalLimit?.toLocaleString()}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className={getProgressClass(currentBudget.status)}
                  style={{ width: getProgressWidth(currentBudget.spentAmount, currentBudget.totalLimit) }}
                />
              </div>
              <p className="progress-section__pct">
                {Math.round((currentBudget.spentAmount / currentBudget.totalLimit) * 100)}% used
              </p>
            </div>

            {/* Per-category progress bars */}
            {currentBudget.categoryStatus?.length > 0 && (
              <div>
                <p className="category-breakdown__title">Category Breakdown</p>
                <div className="category-breakdown-grid">
                  {currentBudget.categoryStatus.map((cs) => (
                    <div key={cs.category} className="category-card">
                      <div className="category-card__header">
                        <span className="category-card__name">{cs.category}</span>
                        <span className={`badge badge--${cs.status}`}>
                          {cs.status === 'safe'      && 'Safe'}
                          {cs.status === 'nearLimit' && 'Near Limit'}
                          {cs.status === 'exceeded'  && 'Exceeded'}
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className={getProgressClass(cs.status)}
                          style={{ width: `${Math.min(cs.usagePercent, 100)}%` }}
                        />
                      </div>
                      <p className="category-card__amounts">
                        PKR {cs.spent.toLocaleString()} / {cs.limit.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── All Budgets Grid ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="budget-loading">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <div className="budget-empty">
            <p>No budgets set yet</p>
            <p>Create a budget to start tracking your monthly spending</p>
          </div>
        ) : (
          <div className="budget-cards-grid">
            {budgets.map((b) => {
              const pct = Math.min(Math.round((b.spentAmount / b.totalLimit) * 100), 100);
              return (
                <div key={b._id} className="budget-card">
                  <div className="budget-card__header">
                    <span className="budget-card__month">{b.month}</span>
                    <span className={`badge badge--${b.status}`}>
                      {b.status === 'safe'      && 'Safe'}
                      {b.status === 'nearLimit' && 'Near Limit'}
                      {b.status === 'exceeded'  && 'Exceeded'}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={getProgressClass(b.status)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="budget-card__amounts">
                    PKR {b.spentAmount?.toLocaleString()} / {b.totalLimit?.toLocaleString()} ({pct}%)
                  </p>
                  <div className="budget-card__actions">
                    <button className="btn btn--teal btn--sm" onClick={() => handleEdit(b)}>Edit</button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(b._id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Create / Edit Budget Modal ────────────────────────────────────── */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="modal__title">
                {editingId ? 'Edit Budget' : 'Set Monthly Budget'}
              </h2>

              {error && <div className="alert alert--error">{error}</div>}

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label htmlFor="month">Month</label>
                  <input
                    id="month"
                    name="month"
                    type="month"
                    value={form.month}
                    onChange={handleFormChange}
                    required
                    disabled={!!editingId} /* can't change month when editing */
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="totalLimit">Total Monthly Limit (PKR)</label>
                  <input
                    id="totalLimit"
                    name="totalLimit"
                    type="number"
                    value={form.totalLimit}
                    onChange={handleFormChange}
                    placeholder="e.g. 50000"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="warningThreshold">
                    Warning Threshold: {form.warningThreshold}%
                  </label>
                  <input
                    id="warningThreshold"
                    name="warningThreshold"
                    type="range"
                    min="50"
                    max="95"
                    value={form.warningThreshold}
                    onChange={handleFormChange}
                  />
                  <p className="slider-hint">
                    Alert me when I reach {form.warningThreshold}% of my budget
                  </p>
                </div>

                {/* ── Per-Category Limits ──────────────────────────────────── */}
                <div className="form-group">
                  <label>Category Limits (optional)</label>

                  {/* Existing category limit rows */}
                  {form.categoryLimits.map((cl) => (
                    <div key={cl.category} className="cat-limit-row">
                      <span className="cat-limit-row__name">{cl.category}</span>
                      <span className="cat-limit-row__amount">
                        PKR {Number(cl.limit).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => removeCategoryLimit(cl.category)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add new category limit row */}
                  <div className="cat-limit-add-row">
                    <select
                      value={newCatLimit.category}
                      onChange={(e) => setNewCatLimit({ ...newCatLimit, category: e.target.value })}
                    >
                      <option value="">Category</option>
                      {/* Only show categories not already added */}
                      {CATEGORIES
                        .filter((c) => !form.categoryLimits.find((cl) => cl.category === c))
                        .map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Limit (PKR)"
                      value={newCatLimit.limit}
                      min="1"
                      onChange={(e) => setNewCatLimit({ ...newCatLimit, limit: e.target.value })}
                    />
                    <button type="button" className="btn btn--teal" onClick={addCategoryLimit}>
                      Add
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={submitLoading}>
                    {submitLoading ? 'Saving...' : editingId ? 'Update Budget' : 'Create Budget'}
                  </button>
                  <button type="button" className="btn btn--secondary" onClick={closeModal}>
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}