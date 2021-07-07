declare module "*.svg" {
  const value: import("react").FunctionComponent<
    React.SVGAttributes<SVGElement>
  >;
  export default value;
}
