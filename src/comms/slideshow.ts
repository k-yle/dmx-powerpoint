import * as TypesSlideshow from 'slideshow';

const { remote } = window.require('electron');
const Interface: typeof TypesSlideshow = remote.require('slideshow');

const software = 'powerpoint'; // TODO: allow user to select
export const slideshow = new Interface(software);
slideshow.boot();
