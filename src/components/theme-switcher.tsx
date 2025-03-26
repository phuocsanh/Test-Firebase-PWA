import { useEffect, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';

const themeOptions = [
  'carmine',
  'carmine.compact',
  'common',
  'contrast',
  'contrast.compact',
  'dark',
  'dark.compact',
  'darkmoon',
  'darkmoon.compact',
  'darkviolet',
  'darkviolet.compact',
  'fluent.blue.dark',
  'fluent.blue.dark.compact',
  'fluent.blue.light',
  'fluent.blue.light.compact',
  'fluent.saas.dark',
  'fluent.saas.dark.compact',
  'fluent.saas.light',
  'fluent.saas.light.compact',
  'greenmist',
  'greenmist.compact',
  'light',
  'light.compact',
  'material.blue.dark',
  'material.blue.dark.compact',
  'material.blue.light',
  'material.blue.light.compact',
  'material.lime.dark',
  'material.lime.dark.compact',
  'material.lime.light',
  'material.lime.light.compact',
  'material.orange.dark',
  'material.orange.dark.compact',
  'material.orange.light',
  'material.orange.light.compact',
  'material.purple.dark',
  'material.purple.dark.compact',
  'material.purple.light',
  'material.purple.light.compact',
  'material.teal.dark',
  'material.teal.dark.compact',
  'material.teal.light',
  'material.teal.light.compact',
  'softblue',
  'softblue.compact',
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem('dx-theme') || 'material.blue.light');

  useEffect(() => {
    // themes.current(theme);
    localStorage.setItem('dx-theme', theme);
  }, [theme]);

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <div>
      <SelectBox
        dataSource={themeOptions}
        value={theme}
        onValueChanged={e => handleThemeChange(e.value as string)}
        placeholder="Select a theme"
        showClearButton={true}
        searchEnabled={true}
        displayExpr={(item: string) =>
          item && item.replace(/\./g, ' ').replace(/(^|\s)\w/g, c => c.toUpperCase()) + ' Theme'
        }
      />
    </div>
  );
}
