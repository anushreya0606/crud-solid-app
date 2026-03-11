// I: Interface Segregation — focused hook, only handles form state
import { useState } from 'react';
import TaskValidator from '../utils/validator';

const useTaskForm = (onSubmit, initial = null) => {
  const blank = { title: "", priority: "Medium", tag: "Feature", notes: "" };
  const [form, setForm] = useState(initial || blank);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    const { valid, error: err } = TaskValidator.validate(form);
    if (!valid) return setError(err);
    setError(null);
    onSubmit(form);
    setForm(blank);
  };

  return { form, error, handleChange, handleSubmit, setForm };
};

export default useTaskForm;
