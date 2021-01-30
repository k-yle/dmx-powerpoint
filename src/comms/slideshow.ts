import Interface from 'slideshow';

const software = 'powerpoint'; // TODO: allow user to select
export const slideshow = new Interface(software);
try {
  slideshow.boot();
} catch (err) {
  slideshow.error = err;
  console.error('Failed to start slideshow module', err);
}
