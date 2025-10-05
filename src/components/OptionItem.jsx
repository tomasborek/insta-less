import { createEffect, createResource, createSignal } from 'solid-js';
import { loadOptions, updateOptions } from '../options';
import { Switch } from './Switch';

export const OptionItem = ({ label, id }) => {
  const [loadedOptions] = createResource(loadOptions);
  const [value, setValue] = createSignal(false);

  createEffect(() => {
    const loadedValue = loadedOptions()?.get(id) ?? false;
    setValue(loadedValue);
  });

  function handleChange(newValue) {
    setValue(newValue);
    updateOptions({ [id]: newValue });
  }

  return (
    <div class="flex items-center gap-4 justify-between">
      <p>{label}</p>
      <Switch onChange={handleChange} value={value} />
    </div>
  );
};
