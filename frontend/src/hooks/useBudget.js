export const useBudget = () => {
  const addCategoryLimit = (newCatLimit, form, setForm, setError) => {
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

    setError('');
  };

  return { addCategoryLimit };
};