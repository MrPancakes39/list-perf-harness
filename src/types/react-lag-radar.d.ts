declare module "react-lag-radar" {
  import { ComponentType } from "react";

  type LagRadarProps = {
    frames?: number;
    speed?: number;
    size?: number;
    inset?: number;
  };

  const LagRadar: ComponentType<LagRadarProps>;
  export default LagRadar;
}
