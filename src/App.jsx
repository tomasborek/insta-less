import { OptionItem } from './components/OptionItem';

const App = () => {
  return (
    <div>
      <header class="p-4 bg-white border-b-[1px] border-gray-200">
        <h1>Insta-less</h1>
      </header>
      <div class="p-4 bg-gray-100">
        <div class="flex flex-col gap-4">
          <OptionItem label="Hide homepage" id="hide-home" />
          <OptionItem label="Redirect to DMs" id="redirect-dms" />
        </div>
      </div>
    </div>
  );
};

export default App;
