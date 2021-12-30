import AugmentClasslist from './augmentChecklist';
import SelectedAugments from './selectedAugments';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import './App.css';

export const muiCache = createCache({
  "key": "mui",
  "prepend": true,
});

function App() {
  return (
    <CacheProvider value={muiCache}>
      <div>
        <header className="App-header">
          <p>
            See what augments do to your equipment in PSO2:NGS
          </p>
          {/* Components that go here can be functional components from another file */}
        </header>
        <AugmentClasslist/>
        <SelectedAugments/>
      </div>
    </CacheProvider>
  );
}

export default App;
