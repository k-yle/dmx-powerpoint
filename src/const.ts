// explicitly set settings if they don't exist so that changes to defaults
// don't break users' setups.
export const OPTIONS = {
  UNIVERSE: localStorage.universe || (localStorage.universe = '1'),
  IFACE: localStorage.iface || (localStorage.iface = 'auto'),
  PPT_SW: localStorage.pptSoftware || (localStorage.pptSoftware = 'powerpoint'),
  START_ADDR: localStorage.startAddr || (localStorage.startAddr = '1'),
};
