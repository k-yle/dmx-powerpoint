declare module 'slideshow' {
  declare type State = 'unknown' | 'viewing';

  declare class Interface {
    constructor(name: string);

    public error: string;

    public boot(): Promise<void>;

    public stat(): Promise<{ slides: number; state: State }>;

    public next(): Promise<void>;

    public prev(): Promise<void>;

    public goto(slideNumber: number): Promise<unknown>;
  }
  export = Interface;
}
