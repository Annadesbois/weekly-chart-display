import { CustomTooltipComponentProps } from "../types";

export const CustomTooltip = ({
  active,
  payload,
  label,
  missingDates,
}: CustomTooltipComponentProps) => {
  if (active && payload && payload.length) {
    const sighting = payload[0].value;
    const isMissing = missingDates.has(label || "");

    return (
      <div className="custom-tooltip">
        <p>{`Date: ${label}`}</p>
        <p>{`Sightings: ${isMissing ? "no data" : sighting}`}</p>
      </div>
    );
  }
  return null;
};
