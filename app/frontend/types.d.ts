// TODO: check if this file is neede, added based on example app with jest.

declare module "*module.css" {
  const styles: {
    [className: string]: string;
  };
  export default styles;
}
