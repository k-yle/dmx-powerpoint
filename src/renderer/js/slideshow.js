import { remote } from 'electron';

const Interface = remote.require('slideshow');

const software = 'powerpoint'; // TODO: allow user to select
const slideshow = new Interface(software);
slideshow.boot();

export default slideshow;
