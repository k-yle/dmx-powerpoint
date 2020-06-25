import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageBar,
  MessageBarType,
  MessageBarButton,
  PrimaryButton,
  Stack,
} from '@fluentui/react';
import { sACN, slideshow } from 'comms';
import { usePrevious } from 'hooks';
import classes from './style/App.module.css';

const DMX_CH_START = 50; // TODO: allow user to select

interface Source {
  name?: string;
  ip?: string;
  lastMsg?: Date;
}

export const App: React.FC = () => {
  const [dmxCh1, setDmxCh1] = useState(0);
  const [dmxCh2, setDmxCh2] = useState(0);
  const [prevDmxCh2] = usePrevious(dmxCh2);
  const [activeSource, setActiveSource] = useState<Source>({});

  const [pptxSlides, setPptxSlides] = useState(0);
  const [pptxState, setPptxState] = useState('unknown');
  const thottle = useRef(false);

  const advanceTo = useCallback(
    async (n: number) => {
      if (thottle.current) {
        console.warn('Throttling PPTX command');
        return;
      }
      if (n > pptxSlides) {
        console.warn("There aren't this many slides");
        return;
      }
      if (n === 0 || n === 100) {
        console.warn('Ignoring min/max ch values');
        return;
      }
      thottle.current = true;
      await slideshow.goto(n);
      thottle.current = false;
    },
    [pptxSlides]
  );

  const updateSlideShowStats = useCallback(async () => {
    const { slides, state } = await slideshow.stat();
    setPptxSlides(slides);
    setPptxState(state);
  }, []);

  useEffect(() => {
    sACN.on('packet', (packet) => {
      // TODO: this gets called far too often, we shouldn't do *any* state updates
      setActiveSource({
        name: packet.sourceName,
        ip: packet.sourceAddress,
        lastMsg: new Date(),
      });
      setDmxCh1(Math.round(packet.payload[DMX_CH_START] / 2.55));
      setDmxCh2(Math.round(packet.payload[DMX_CH_START + 1] / 2.55));
    });
    // TODO: update sACN library to support .off which we can call in cleanup function

    updateSlideShowStats();
    // refresh every 10seconds
    const id = setInterval(updateSlideShowStats, 10_000);
    return (): void => clearInterval(id);

    // hook deps: this should only run once.
  }, [updateSlideShowStats]);

  useEffect(() => {
    advanceTo(dmxCh1);
  }, [advanceTo, dmxCh1]);

  useEffect(() => {
    const [newV, oldV] = [dmxCh2, prevDmxCh2];
    if (newV >= 20 && newV <= 39) {
      if (oldV >= 20 && oldV <= 39) {
        console.log('fader already in this range; ignoring');
      } else {
        console.warn('prev slide!');
        slideshow.prev();
      }
    } else if (newV >= 60 && newV <= 79) {
      if (oldV >= 60 && oldV <= 79) {
        console.log('fader already in this range; ignoring');
      } else {
        console.warn('next slide!');
        slideshow.next();
      }
    }
  }, [dmxCh2, prevDmxCh2]);

  return (
    <div className={classes.container}>
      <h1>DMX Powerpoint</h1>
      <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
        System is <strong>OK</strong>
      </MessageBar>
      {/* POWERPOINT STATUS */}
      {pptxState === 'viewing' ? (
        <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
          PowerPoint is <strong>OK</strong> ({pptxSlides} slides)
        </MessageBar>
      ) : (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          actions={
            <div>
              <MessageBarButton onClick={updateSlideShowStats}>
                Refresh
              </MessageBarButton>
            </div>
          }
        >
          PowerPoint: No active presentation.
        </MessageBar>
      )}
      {/* sACN STATUS */}
      {activeSource.ip ? (
        <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
          sACN connection is <strong>OK</strong> (connected to{' '}
          {activeSource.name})
        </MessageBar>
      ) : (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          sACN: No data being received.
        </MessageBar>
      )}
      <br />
      DMX Value: {dmxCh1}% / {dmxCh2}%
      <Stack horizontal gap={40}>
        <PrimaryButton text='Help' onClick={console.log} />
        <PrimaryButton text='Settings' onClick={console.log} />
      </Stack>
      <p>
        <strong>Settings:</strong> <br />
        DMX Universe: 1 <br />
        DMX Channel: 50 (-51) <br />
        Network interface: auto / dropdown list <br />
        Presentation software: powerpoint <br />
      </p>
      <p>
        <strong>Channel1:</strong> <br />
        0% = nothing <br />
        1-99% = go to slides 1 - 99 <br />
        100% = nothing <br />
        <strong>Channel 2:</strong> <br />
        0-19% = nothing <br />
        20-39% = previous slide <br />
        40-59% = nothing <br />
        60-79% = next slide <br />
        80-99% = nothing <br />
        100% = next slide <br />
      </p>
    </div>
  );
};
