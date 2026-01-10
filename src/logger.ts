export default new (class LoggerInstance {
  constructor() {}

  public error(...args: string[]): void {
    console.error("error", this.toString(args));
  }

  public debug(...args: string[]): void {
    console.log("debug", this.toString(args));
  }

  public warn(...args: string[]): void {
    console.warn("warn", this.toString(args));
  }

  public toString(args: string[]): string {
    return args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
  }
})();
