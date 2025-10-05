export function Switch({ value, onChange }) {
  const toggle = () => {
    onChange?.(!value());
  };

  return (
    <div class="flex items-center space-x-3">
      <button
        type="button"
        onClick={toggle}
        class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
          value() ? 'bg-gray-900' : 'bg-gray-300'
        }`}
        role="switch"
        aria-checked={value()}
        aria-label="Toggle switch"
      >
        <span
          class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
            value() ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
