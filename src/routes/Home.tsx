import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  MessageBar,
  MessageBarType,
  MessageBarButton,
  PrimaryButton,
  Stack,
} from '@fluentui/react';
import { sACN, slideshow } from 'comms';
import { usePrevious } from 'hooks';
import { Link } from 'react-router-dom';
import { RootContext } from 'wrappers';
import { OPTIONS } from 'const';
import { Packet } from 'sacn';

interface Source {
  name?: string;
  ip?: string;
  lastMsg?: Date;
}

export const Home: React.FC = () => {
  const { needsRestart } = useContext(RootContext);

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
    const onPacket = (packet: Packet): void => {
      // TODO: this gets called far too often, we shouldn't do *any* state updates
      setActiveSource({
        name: packet.sourceName,
        ip: packet.sourceAddress,
        lastMsg: new Date(),
      });
      setDmxCh1(Math.round(packet.payload[OPTIONS.START_ADDR] / 2.55));
      setDmxCh2(Math.round(packet.payload[OPTIONS.START_ADDR + 1] / 2.55));
    };
    sACN.on('packet', onPacket);

    updateSlideShowStats(); // refresh every 10seconds
    const id = setInterval(updateSlideShowStats, 10_000);

    return (): void => {
      // cleanup
      sACN.off('packet', onPacket);
      clearInterval(id);
    };

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
    <div>
      <h1>DMX Powerpoint</h1>
      {/* App Status */}
      {needsRestart ? (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline={false}>
          You&apos;ve made some changes to settings that won&apos;t be applied
          until you restart this app
        </MessageBar>
      ) : (
        <MessageBar messageBarType={MessageBarType.success} isMultiline={false}>
          System is <strong>OK</strong>
        </MessageBar>
      )}
      {/* PowerPoint Status */}
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
      {/* sACN Status */}
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
      <br />
      <br />
      <Stack horizontal horizontalAlign='center' gap={40}>
        <Link to='/settings'>
          <PrimaryButton text='Settings' />
        </Link>
        <Link to='/help'>
          <PrimaryButton text='Help' />
        </Link>
      </Stack>
    </div>
  );
};
