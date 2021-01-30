import { loadTheme, initializeIcons } from '@fluentui/react';

initializeIcons();

// https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/

loadTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#323130',
    neutralLighter: '#31302f',
    neutralLight: '#71afe5',
    neutralQuaternaryAlt: '#2c2b2a',
    neutralQuaternary: '#2a2928',
    neutralTertiaryAlt: '#282726',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#323130',
  },
});
